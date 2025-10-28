import { Component, input } from '@angular/core';
import { FormBase } from '../form-base';
import { GmNodeOptions } from '../../utils/gm-node-options';
import { ReactiveFormsModule } from '@angular/forms';
import { GmNode } from '../../models/map-node';

@Component({
  selector: 'app-stats-form',
  imports: [ReactiveFormsModule],
  templateUrl: './stats-form.html',
  styleUrl: './stats-form.css',
})
export class StatsForm extends FormBase {
  constructor(protected nodeOptions: GmNodeOptions) {
    super();
  }

  getStatsBonus(stat: string): string {
    var bonus = this.getStatsBonusValue(stat);
    var asString = bonus.toString();
    if (bonus >= 0) {
      asString = '+' + asString;
    }
    return asString;
  }

  getStatsBonusValue(stat: string): number {
    var asNumber = parseInt(stat);
    return Math.floor((asNumber - 10) / 2);
  }

  getStatBonusClass(stat: string): string {
    var bonus = this.getStatsBonusValue(stat);
    if (bonus > 0) {
      return 'statBonus positive';
    }
    if (bonus < 0) {
      return 'statBonus negative';
    }
    return 'statBonus';
  }
}
