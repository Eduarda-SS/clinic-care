import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockMetrics } from '@/data/mockUsers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export function AdminDashboard() {
  const roleData = Object.entries(mockMetrics.usersByRole).map(([role, count]) => ({
    name: role,
    value: count
  }));

  const departmentData = Object.entries(mockMetrics.departmentMetrics).map(([dept, data]) => ({
    name: dept,
    total: data.users,
    active: data.active,
    percentage: (data.active / data.users) * 100
  }));

  const activityData = [
    { period: 'Hoje', users: mockMetrics.performanceMetrics.dailyActiveUsers },
    { period: 'Esta Semana', users: mockMetrics.performanceMetrics.weeklyActiveUsers },
    { period: 'Este Mês', users: mockMetrics.performanceMetrics.monthlyActiveUsers }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Administrativo</h2>
        <p className="text-muted-foreground">
          Visão geral completa do sistema MediConnect
        </p>
      </div>

      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Badge variant="outline">{mockMetrics.totalUsers}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {mockMetrics.totalUsers - mockMetrics.activeUsers} inativos
            </p>
            <Progress 
              value={(mockMetrics.activeUsers / mockMetrics.totalUsers) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Usuários</CardTitle>
            <Badge variant="secondary">+{mockMetrics.newUsersThisMonth}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Este Mês</div>
            <p className="text-xs text-muted-foreground">
              +20% comparado ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio de Sessão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.performanceMetrics.averageSessionTime}</div>
            <p className="text-xs text-muted-foreground">
              +5% comparado à semana anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Atividade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((mockMetrics.activeUsers / mockMetrics.totalUsers) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Usuários ativos vs total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Perfil</CardTitle>
            <CardDescription>
              Quantidade de usuários por tipo de perfil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade de Usuários</CardTitle>
            <CardDescription>
              Usuários ativos por período
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Departamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Performance por Departamento</CardTitle>
          <CardDescription>
            Atividade e engajamento dos usuários por departamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentData.map((dept) => (
              <div key={dept.name} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{dept.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {dept.active}/{dept.total} ativos ({dept.percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <Progress value={dept.percentage} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}