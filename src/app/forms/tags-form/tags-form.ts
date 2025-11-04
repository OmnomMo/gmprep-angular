import { Component, inject, Signal, signal } from '@angular/core';
import { FormBase } from '../form-base';
import { InlineNameForm } from "../inline-name-form/inline-name-form";
import { TagService } from '../../tag-service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tags-form',
  templateUrl: './tags-form.html',
  styleUrl: './tags-form.css'
})
export class TagsForm extends FormBase{

	addingTag = signal<boolean>(false);

	private tagService = inject(TagService);


	getTags() : string[] {
		return this.tagService.getTags(this.getControlValue());
	}

	setTags(tags : string[]) {
		this.setControlValue(tags.join(';'));
		this.onChange.emit();
	}

	removeTag(tag : string) {
		var tags: string[] = this.getTags();
		tags = tags.filter(tagEntry => tagEntry != tag);
		this.setTags(tags);
	}

	addTag(tag : string) {
		var tags : string[] = this.getTags();
		tags.push(tag);
		this.setTags(tags);
	}

	onAddTagSubmit(newTag: string) {
		this.addTag(newTag);
		this.addingTag.set(false);
	}

	onKeyDown(e: KeyboardEvent) {
		if (e.key == "Escape") {
			this.addingTag.set(false);
		}
	}
}
