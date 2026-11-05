import {Component, computed, ElementRef, signal, ViewChild} from '@angular/core';
import {WANDERLIST, WANDERLIST_DEFAULT_IMAGE, WanderlistStatus} from '../../data/wanderlist';

type WanderlistFilter = 'all' | WanderlistStatus;

@Component({
    selector: 'app-wanderlist',
    standalone: true,
    templateUrl: './wanderlist.html',
    styleUrl: './wanderlist.scss',
})
export class WanderlistComponent {
    @ViewChild('wanderlistDialog') private dialog?: ElementRef<HTMLDialogElement>;
    @ViewChild('destinationList') private destinationList?: ElementRef<HTMLElement>;
    readonly places = WANDERLIST;
    readonly defaultImage = WANDERLIST_DEFAULT_IMAGE;
    readonly activeFilter = signal<WanderlistFilter>('all');
    readonly filters: {value: WanderlistFilter; label: string}[] = [
        {value: 'all', label: 'All'},
        {value: 'visited', label: 'Visited'},
        {value: 'wishlist', label: 'To go'},
    ];
    readonly visitedCount = this.places.filter(place => place.status === 'visited').length;
    readonly wishlistCount = this.places.length - this.visitedCount;
    readonly filteredPlaces = computed(() => {
        const filter = this.activeFilter();
        return filter === 'all' ? this.places : this.places.filter(place => place.status === filter);
    });

    open(): void {
        const dialog = this.dialog?.nativeElement;
        if (dialog && !dialog.open) {
            this.activeFilter.set('all');
            dialog.showModal();
            this.resetScroll();
        }
    }

    setFilter(filter: WanderlistFilter): void {
        this.activeFilter.set(filter);
        this.resetScroll();
    }

    private resetScroll(): void {
        if (this.destinationList) this.destinationList.nativeElement.scrollTop = 0;
    }

    close(): void {
        this.dialog?.nativeElement.close();
    }

    onBackdropClick(event: MouseEvent): void {
        const dialog = this.dialog?.nativeElement;
        if (!dialog || event.target !== dialog) return;
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom) {
            dialog.close();
        }
    }

    onImageError(event: Event): void {
        const image = event.target as HTMLImageElement;
        if (image.getAttribute('src') === this.defaultImage) {
            image.hidden = true;
        } else {
            image.src = this.defaultImage;
        }
    }
}
