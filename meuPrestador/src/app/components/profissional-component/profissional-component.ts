import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Profissional_service } from '../../services/Profissional_service';
import { Profissional } from '../../interfaces/Profissional_interface';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap, map } from 'rxjs';

@Component({
  selector: 'app-profissional-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profissional-component.html',
  styleUrl: './profissional-component.scss',
})
export class ProfissionalComponent implements OnInit {

  private profissionalService = inject(Profissional_service);
  private route = inject(ActivatedRoute);

  lista_de_profissional$!: Observable<Profissional[]>;

  ngOnInit(): void {
    // Escutamos o parâmetro 'id' da URL
    this.lista_de_profissional$ = this.route.paramMap.pipe(
      map(params => Number(params.get('id'))), // Converte o ID da URL para número
      switchMap(id => {
        // Agora passamos o ID dinâmico para o seu serviço
        return this.profissionalService.getProfissionaisPorServico(id);
      })
    );
  }
}
