import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ClienteComponent } from './components/cliente-component/cliente-component';
import { ServicoComponent } from './components/servico-component/servico-component';
import { ProfissionalComponent } from './components/profissional-component/profissional-component';
import { SolicitacaoComponent } from './components/solicitacao-component/solicitacao-component';

export const routes = [
    { path: '', component: HomeComponent },
    { path: 'servico', component: ServicoComponent },
    { path: 'profissional/:id', component: ProfissionalComponent },
    { path: 'solicitacao', component: SolicitacaoComponent },
    { path: 'cliente', component: ClienteComponent },
    { path: '**', redirectTo: 'servico' }
];
