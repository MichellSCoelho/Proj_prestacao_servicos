import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ClienteService } from '../../services/Cliente_service';
import { ClienteInterface } from '../../interfaces/Cliente_interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-component.html',
  styleUrl: './cliente-component.scss',
})
export class ClienteComponent {

  private clienteService = inject(ClienteService);
  private router = inject(Router);

  lista_de_clientes$!: Observable<ClienteInterface[]>;
  cliente: ClienteInterface = {} as ClienteInterface;

  mensagemSucesso: string = '';

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.lista_de_clientes$ = this.clienteService.getCliente_service();
  }

  salvar(): void {

    if (!this.cliente.nome || !this.cliente.email || !this.cliente.telefone) {
      alert("Preencha todos os campos!");
      return;
    }

    this.clienteService.saveClient(this.cliente).subscribe({
      next: () => {

        this.mensagemSucesso = "Cliente cadastrado com Sucesso!";

        this.listar(); // Atualiza lista

        this.cliente = {} as ClienteInterface; // Limpa formulário

      },
      error: (err) => {
        console.error("Erro ao salvar cliente:", err);
        alert("Erro ao salvar cliente. Verifique o backend.");
      }
    });
  }

  voltarHome(): void {
    this.router.navigateByUrl('/');
  }
}