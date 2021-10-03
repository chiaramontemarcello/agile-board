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
import { BehaviorSubject, Observable } from 'rxjs';
import { PositionUpdate } from '../components/kanban/kanban.component';
import { WebsocketService } from '../services/websocket.service';

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
  viewportDimentions: any;

  @Input()
  clientId: string = '';

  @Input()
  objectId: string = '';

  @Input()
  options: any;

  @Output()
  draggableClick = new EventEmitter();

  private currentlyDragged = false;

  constructor(
    private element: ElementRef,
    private webSocketService: WebsocketService
  ) {}

  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    if (!this.currentlyDragged) {
      this.draggableClick.emit();

      console.log('current position', this.element.nativeElement);
    }
  }

  ngOnInit(): void {
    this.handleUserInteraction();
    this.updatePositionOnChanges();
    this.subscribeResetLocation();
  }

  /**
   * Move block arround on the other clients side
   */
  updatePositionOnChanges() {
    this.webSocketService.position.subscribe((res: PositionUpdate) => {
      if (
        this.clientId &&
        this.objectId &&
        res &&
        this.clientId !== res.clientId &&
        this.objectId === res.objectId
      ) {
        this.element.nativeElement.style.transform =
          'translate(' +
          res.coordinates.x * this.viewportDimentions.width +
          'px, ' +
          res.coordinates.y * this.viewportDimentions.height +
          'px)';
      }
    });
  }

  subscribeResetLocation() {
    this.webSocketService.updateView.subscribe((message) => {
      if (message && this.objectId === message.objectId) {
        if (message.action === 'reset_location') {
          this.element.nativeElement.style.transform = 'none';
        }
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

        const x_relative = x / this.viewportDimentions.width;
        const y_relative = y / this.viewportDimentions.height;

        this.webSocketService.emitNewPosition({
          coordinates: { x: x_relative, y: y_relative },
          clientId: this.clientId,
          objectId: this.objectId,
        });

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

        console.log('dropped from draggable');

        setTimeout(() => {
          (window as any).dragData = null;
          this.currentlyDragged = false;
          // this.webSocketService.resetPosition(this.objectId);
        });
      });
  }
}
