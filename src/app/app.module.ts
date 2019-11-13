import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UnitStatsComponent } from './unit-stats/unit-stats.component';
import { BattleFieldComponent } from './battle-field/battle-field.component';
import { CombatStatsComponent } from './combat-stats/combat-stats.component';
import { CombatTurnStatsComponent } from './combat-turn-stats/combat-turn-stats.component';

@NgModule({
  declarations: [
    AppComponent,
    UnitStatsComponent,
    BattleFieldComponent,
    CombatStatsComponent,
    CombatTurnStatsComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
