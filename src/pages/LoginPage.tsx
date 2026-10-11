import { useEffect, useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, FieldError, Input, Label, TextField } from '@heroui/react';
import { ArrowLeft, Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const PASOS = ['Pre-inscripción', 'Documentos', 'Entrevistas', 'Decisión', 'Matrícula'];

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { estado, login, verificarSesion } = useAuthStore();

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Solo se aceptan rutas internas para evitar redirecciones abiertas
  const redirectParam = searchParams.get('redirect') ?? '';
  const destino = redirectParam.startsWith('/') && !redirectParam.startsWith('//') ? redirectParam : '/dashboard';

  useEffect(() => {
    void verificarSesion();
  }, [verificarSesion]);

  if (estado === 'autenticado') return <Navigate to={destino} replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!correo.trim() || !password) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await login(correo.trim(), password);
      navigate(destino, { replace: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo iniciar sesión. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-paper font-body text-ink lg:grid-cols-[1.1fr_1fr]">
      {/* Panel institucional */}
      <section className="relative hidden overflow-hidden bg-navy-900 p-12 text-paper lg:flex lg:flex-col lg:justify-between">
        <div className="grain pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500 font-display text-sm font-bold text-navy-950">
            U
          </span>
          <span className="font-display text-xl">UNAC · Admisiones</span>
        </div>

        <div className="relative max-w-md">
          <span className="eyebrow text-gold-300">Panel administrativo</span>
          <h1 className="mt-3 font-display text-5xl leading-tight">
            Cada aspirante, <em className="text-gold-300">un proceso</em> claro.
          </h1>
          <p className="mt-4 text-paper/65">
            Gestiona solicitudes, documentos, entrevistas y decisiones de admisión en un solo lugar.
          </p>
          <ol className="mt-8 flex flex-wrap gap-2">
            {PASOS.map((paso, i) => (
              <li key={paso} className="rounded-full border border-paper/15 bg-white/5 px-3 py-1 text-xs text-paper/80">
                <span className="mr-1 font-mono text-gold-300">0{i + 1}</span>
                {paso}
              </li>
            ))}
          </ol>
        </div>

        <p className="relative flex items-center gap-2 text-xs text-paper/50">
          <ShieldCheck size={14} /> Acceso exclusivo para funcionarios autorizados.
        </p>
      </section>

      {/* Formulario */}
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition hover:text-navy-900">
            <ArrowLeft size={16} /> Volver al sitio
          </Link>

          <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-900 text-gold-300">
            <LockKeyhole size={22} />
          </div>
          <h2 className="mt-5 font-display text-3xl text-navy-900">Iniciar sesión</h2>
          <p className="mt-1 text-sm text-ink-soft">Ingresa con tu correo institucional.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
            <TextField isInvalid={!!error}>
              <Label>Correo</Label>
              <Input
                type="email"
                autoComplete="username"
                placeholder="nombre@unac.edu.co"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                autoFocus
              />
            </TextField>

            <TextField isInvalid={!!error}>
              <Label>Contraseña</Label>
              <div className="relative">
                <Input
                  type={verPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setVerPassword((v) => !v)}
                  aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-ink-soft hover:text-navy-900"
                >
                  {verPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <FieldError>{error}</FieldError>
            </TextField>

            {error && (
              <p role="alert" className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" isPending={isSubmitting}>
              Entrar al panel
            </Button>
          </form>

          <p className="mt-6 text-xs text-ink-soft">
            ¿No tienes acceso o olvidaste tu contraseña? Pídele al administrador del sistema que te la asigne.
          </p>
        </div>
      </section>
    </main>
  );
}
