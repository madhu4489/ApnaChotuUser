import { NgModule } from '@angular/core';
import { CustomCounterComponent } from './custom-counter/custom-counter';
import { CustomOrdercounterComponent } from './custom-ordercounter/custom-ordercounter';
@NgModule({
	declarations: [CustomCounterComponent,
    CustomOrdercounterComponent],
	imports: [],
	exports: [CustomCounterComponent,
    CustomOrdercounterComponent]
})
export class ComponentsModule {}
