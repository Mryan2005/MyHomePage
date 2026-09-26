import {Component, EventEmitter, HostListener, Output} from '@angular/core';
import {
    ANCESTOR_ALLOW_PULL_BACK,
    ANCESTOR_BLOCKED_BACKWARD_MESSAGES,
    ANCESTOR_CURRENT_STATE,
    ANCESTOR_CURRENT_VIBE,
    ANCESTOR_FORWARD_HINT,
    ANCESTOR_RANKS,
    AncestorRank
} from '../../data/ancestor-rheostat';

@Component({
    selector: 'app-sliding-ancestor-rheostat',
    standalone: true,
    imports: [],
    templateUrl: './sliding-ancestor-rheostat.html',
    styleUrl: './sliding-ancestor-rheostat.scss'
})
export class SlidingAncestorRheostatComponent {
    @Output() closed = new EventEmitter<void>();

    readonly ranks: AncestorRank[] = ANCESTOR_RANKS;
    readonly currentStatus = ANCESTOR_CURRENT_STATE;
    readonly currentVibeIndex = Math.max(0, Math.min(ANCESTOR_RANKS.length - 1, ANCESTOR_CURRENT_VIBE));
    readonly currentVibe = ANCESTOR_RANKS[this.currentVibeIndex];

    selectedIndex = this.currentVibeIndex;
    feedback = '';
    feedbackKind: 'blocked' | 'forward' = 'forward';
    private feedbackTimer?: ReturnType<typeof setTimeout>;

    get selectedRank(): AncestorRank {
        return this.ranks[this.selectedIndex];
    }

    get progress(): number {
        return this.selectedIndex / (this.ranks.length - 1) * 100;
    }

    get intensity(): string {
        return String(this.selectedIndex * 6).padStart(2, '0');
    }

    get thumbPosition(): string {
        const edgeOffset = 27 - 54 * (this.progress / 100);
        return `calc(${this.progress}% + ${edgeOffset}px)`;
    }

    selectRank(index: number): boolean {
        const nextIndex = Math.max(0, Math.min(this.ranks.length - 1, Math.round(index)));

        if (nextIndex < this.currentVibeIndex && !ANCESTOR_ALLOW_PULL_BACK) {
            const messages = ANCESTOR_BLOCKED_BACKWARD_MESSAGES;
            const message = messages[Math.floor(Math.random() * messages.length)] ?? '不能往回拉。';
            window.alert(message);
            return false;
        }

        if (nextIndex > this.selectedIndex) {
            this.showFeedback(
                ANCESTOR_FORWARD_HINT[nextIndex] ?? '祖气上升中，继续往前。',
                'forward'
            );
        }

        const changed = nextIndex !== this.selectedIndex;
        this.selectedIndex = nextIndex;
        return changed;
    }

    onRangeInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        const previousIndex = this.selectedIndex;
        this.selectRank(Number(input.value));
        if (this.selectedIndex === previousIndex) {
            input.value = String(previousIndex);
        }
    }

    private showFeedback(message: string, kind: 'blocked' | 'forward'): void {
        this.feedback = message;
        this.feedbackKind = kind;
        if (this.feedbackTimer) clearTimeout(this.feedbackTimer);
        this.feedbackTimer = setTimeout(() => this.feedback = '', 2400);
    }

    close(): void {
        this.closed.emit();
    }

    @HostListener('document:keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.close();
            return;
        }
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            this.selectRank(this.selectedIndex - 1);
        }
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            this.selectRank(this.selectedIndex + 1);
        }
    }
}
