import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-big-button',
  imports: [],
  templateUrl: './big-button.html',
  styleUrl: './big-button.css'
})
export class BigButton {
	id = input.required<number>();
	title = input.required<string>();
	description = input<string>("");
	backgroundImageStyle = input<string>("");

	onClick = output<void>();
	onEdit = output<void>();
	onDelete = output<void>();

	clicked() {
		this.onClick.emit();
	}

	clickedEdit(event: PointerEvent) {
		event.stopPropagation()
		this.onEdit.emit();
	}

	clickedDelete(event: PointerEvent) {
		event.stopPropagation()
		this.onDelete.emit();
	}
}
