import django_filters
from .models import Cliente, Profissional, Servico, Solicitacao


# ===============================
# CLIENTE
# ===============================
class ClienteFilter(django_filters.FilterSet):
    nome = django_filters.CharFilter(lookup_expr='icontains')
    email = django_filters.CharFilter(lookup_expr='icontains')
    telefone = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Cliente
        fields = ['id', 'nome', 'email', 'telefone']


# ===============================
# PROFISSIONAL
# ===============================
class ProfissionalFilter(django_filters.FilterSet):
    nome = django_filters.CharFilter(lookup_expr='icontains')
    especialidade = django_filters.CharFilter(lookup_expr='icontains')
    ativo = django_filters.BooleanFilter()

    class Meta:
        model = Profissional
        fields = ['id', 'nome', 'especialidade', 'ativo']


# ===============================
# SERVIÇO
# ===============================
class ServicoFilter(django_filters.FilterSet):
    nome = django_filters.CharFilter(lookup_expr='icontains')
    descricao = django_filters.CharFilter(lookup_expr='icontains')
    valor_min = django_filters.NumberFilter(field_name='valor_base', lookup_expr='gte')
    valor_max = django_filters.NumberFilter(field_name='valor_base', lookup_expr='lte')

    class Meta:
        model = Servico
        fields = ['id', 'nome', 'descricao', 'valor_min', 'valor_max']


# ===============================
# SOLICITAÇÃO
# ===============================
class SolicitacaoFilter(django_filters.FilterSet):
    cliente_id = django_filters.NumberFilter(field_name='cliente__id')
    cliente_nome = django_filters.CharFilter(field_name='cliente__nome', lookup_expr='icontains')

    profissional_id = django_filters.NumberFilter(field_name='profissional__id')
    profissional_nome = django_filters.CharFilter(field_name='profissional__nome', lookup_expr='icontains')

    servico_id = django_filters.NumberFilter(field_name='servico__id')
    servico_nome = django_filters.CharFilter(field_name='servico__nome', lookup_expr='icontains')

    status = django_filters.CharFilter(lookup_expr='exact')

    data_inicio = django_filters.DateFilter(field_name='data_solicitacao', lookup_expr='gte')
    data_fim = django_filters.DateFilter(field_name='data_solicitacao', lookup_expr='lte')

    class Meta:
        model = Solicitacao
        fields = [
            'id',
            'cliente_id',
            'cliente_nome',
            'profissional_id',
            'profissional_nome',
            'servico_id',
            'servico_nome',
            'status',
            'data_inicio',
            'data_fim'
        ]