import {Component, EventEmitter, HostListener, Output} from '@angular/core';
import {
    ANCESTOR_CURRENT_STATE,
    ANCESTOR_CURRENT_VIBE,
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

    selectRank(index: number): void {
        this.selectedIndex = Math.max(0, Math.min(this.ranks.length - 1, Math.round(index)));
    }

    onRangeInput(event: Event): void {
        this.selectRank(Number((event.target as HTMLInputElement).value));
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
