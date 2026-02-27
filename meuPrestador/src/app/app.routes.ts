import { Routes } from '@angular/router';
import { ClienteComponent } from './components/cliente-component/cliente-component';
import { ServicoComponent } from './components/servico-component/servico-component';
import { ProfissionalComponent } from './components/profissional-component/profissional-component';
import { SolicitacaoComponent } from './components/solicitacao-component/solicitacao-component';

export const routes: Routes = [
    { path: '', component: ServicoComponent },
    { path: 'profissional', component: ProfissionalComponent },
    { path: 'solicitacao', component: SolicitacaoComponent },
    { path: 'cliente', component: ClienteComponent },
    { path: '**', redirectTo: '' }
];
