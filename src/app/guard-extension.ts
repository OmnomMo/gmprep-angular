import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot, UrlTree } from '@angular/router';
import { first, Observable, Subscription } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class GuardExtension {

	subscrpition : Subscription | null = null;

	//evaulates given guards and calls onSuccess and onFailure after a short delay
	evaluateAfterPrerequisite(
		prerequisite: CanActivate,
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot,
		onSuccess: () => void,
		onFailure: (result: GuardResult) => void
	) {
		var result: MaybeAsync<GuardResult> = prerequisite.canActivate(route, state);

		if (result instanceof Observable) {
			console.log("Requirement returns observable")
			var asObservable = result as Observable<GuardResult>;
			asObservable.pipe(first()).subscribe({
				next: (value) => {
					this.evaulateResult(value, onSuccess, onFailure)
				}
			})
		} else {
			this.evaulateResult(result as GuardResult, onSuccess, onFailure)
		}

	}


	evaulateResult(result: GuardResult, onSuccess: () => void, onFailure: (result: GuardResult) => void) {
		if (typeof result === "boolean") {
			console.log("Requirement returned boolean");
			if (result as boolean) {
				this.callDelayed(onSuccess, true)
			} else {
				this.callDelayed(onFailure, false)
			}
		}
		if (result instanceof UrlTree) {
			console.log("Requirement returned urltree");
			this.callDelayed(onFailure, result)
		}
	}

	callDelayed(callable: (result: GuardResult) => void, result: GuardResult) {
		console.log("start call delayed")
		setTimeout(callable, 100, result);
	}


}
