import {afterNextRender, Component, EventEmitter, HostListener, Output} from '@angular/core';
import {
    ANCESTOR_ALLOW_PULL_BACK,
    ANCESTOR_BLOCKED_BACKWARD_MESSAGES,
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
    readonly currentVibeIndex = Math.max(0, Math.min(ANCESTOR_RANKS.length - 1, ANCESTOR_CURRENT_VIBE));

    selectedIndex = this.currentVibeIndex;
    dragPosition = this.currentVibeIndex;
    feedback = '';
    feedbackKind: 'blocked' | 'forward' = 'forward';
    private feedbackTimer?: ReturnType<typeof setTimeout>;
    private readonly preloadedImages: HTMLImageElement[] = [];

    constructor() {
        afterNextRender(() => {
            for (const rank of this.ranks) {
                const image = new Image();
                image.decoding = 'async';
                image.src = rank.image;
                void image.decode().catch(() => undefined);
                this.preloadedImages.push(image);
            }
        });
    }

    get selectedRank(): AncestorRank {
        return this.ranks[this.selectedIndex];
    }

    get currentVibe(): AncestorRank {
        return this.selectedRank;
    }

    get currentStatus(): string {
        return ANCESTOR_FORWARD_HINT[this.selectedIndex] ?? '';
    }

    get progress(): number {
        return this.dragPosition / (this.ranks.length - 1) * 100;
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

        const changed = nextIndex !== this.selectedIndex;
        const wasForward = nextIndex > this.selectedIndex;
        this.selectedIndex = nextIndex;
        this.dragPosition = nextIndex;

        const status = this.currentStatus;

        if (wasForward) {
            this.showFeedback(status, 'forward');
        }

        return changed;
    }

    onRangeInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        const position = Math.max(0, Math.min(this.ranks.length - 1, Number(input.value)));
        const nextIndex = position > this.dragPosition
            ? Math.ceil(position)
            : position < this.dragPosition
                ? Math.floor(position)
                : this.selectedIndex;

        if (nextIndex < this.currentVibeIndex && !ANCESTOR_ALLOW_PULL_BACK) {
            this.selectRank(nextIndex);
            input.value = String(this.dragPosition);
            return;
        }

        this.selectRank(nextIndex);
        this.dragPosition = position;
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
