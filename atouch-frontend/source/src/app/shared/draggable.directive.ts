import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import interact from 'interactjs';
import { Observable } from 'rxjs';
import { PositionUpdate } from '../components/kanban/kanban.component';

export interface Coordinate {
  x: number;
  y: number;
}

@Directive({
  selector: '[appDraggable]',
})
export class DraggableDirective implements OnInit {
  @Input()
  model: any;

  @Input()
  clientId: string = '';

  @Input()
  positionUpdate: Observable<PositionUpdate> = new Observable();

  @Input()
  options: any;

  @Output()
  draggableClick = new EventEmitter();

  @Output()
  coordinates: EventEmitter<Coordinate> = new EventEmitter();

  private currentlyDragged = false;

  constructor(private element: ElementRef) {}

  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    if (!this.currentlyDragged) {
      this.draggableClick.emit();
    }
  }

  ngOnInit(): void {
    this.handleUserInteraction();
    this.updatePositionOnChanges();
  }

  /**
   * Move block arround on the other clients side
   */
  updatePositionOnChanges() {
    interact(this.element.nativeElement).on('any', (event) => {
      console.log('any event');
    });

    this.positionUpdate.subscribe((res) => {
      if (this.clientId !== res.clientId) {
        this.element.nativeElement.style.transform =
          'translate(' + res.coordinates.x + 'px, ' + res.coordinates.y + 'px)';
      }
    });
  }

  handleUserInteraction() {
    interact(this.element.nativeElement)
      .draggable(Object.assign({}, this.options || {}))
      .on('dragmove', (event) => {
        const target = event.target;
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        this.coordinates.emit({ x: x, y: y });

        target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);

        target.classList.add('getting-dragged');
        this.currentlyDragged = true;
        (window as any).dragData = this.model;
      })
      .on('dragend', (event) => {
        event.target.style.transform = 'none';
        event.target.removeAttribute('data-x');
        event.target.removeAttribute('data-y');
        event.target.classList.remove('getting-dragged');
        setTimeout(() => {
          (window as any).dragData = null;
          this.currentlyDragged = false;
        });
      });
  }
}
