import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUp,
  Award,
  BookOpen,
  ClipboardPen,
  RotateCcw,
  Smartphone,
  Sparkles,
  X,
} from 'lucide-react';
import { chatApi } from '../../api/chat';
import { ChatMarkdown } from './ChatMarkdown';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  at: number;
  error?: boolean;
}

const SESSION_KEY = 'unac-chat-session';
const MESSAGES_KEY = 'unac-chat-messages';
const TEASER_KEY = 'unac-chat-teaser-visto';
const MAX_LENGTH = 1000;

const QUICK_ACTIONS = [
  { icon: BookOpen, label: 'Ver programas', prompt: '¿Qué programas académicos tienen disponibles?' },
  { icon: ClipboardPen, label: 'Pre-inscribirme', prompt: 'Quiero pre-inscribirme para estudiar en la UNAC.' },
  { icon: Award, label: 'Becas y beneficios', prompt: '¿Qué becas y beneficios ofrecen?' },
  { icon: Smartphone, label: 'Info a mi WhatsApp', prompt: 'Quiero que me envíes la información de admisiones a mi WhatsApp.' },
];

const TYPING_STATUS = ['Pensando…', 'Consultando información de admisiones…', 'Preparando tu respuesta…'];

const nuevoId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const leer = <T,>(storage: () => Storage, key: string, fallback: T): T => {
  try {
    const raw = storage().getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const guardar = (storage: () => Storage, key: string, value: unknown) => {
  try {
    storage().setItem(key, JSON.stringify(value));
  } catch {
    /* almacenamiento no disponible: el chat sigue funcionando en memoria */
  }
};

const obtenerSesion = () => {
  const existente = leer<string | null>(() => localStorage, SESSION_KEY, null);
  if (existente) return existente;
  const id = nuevoId();
  guardar(() => localStorage, SESSION_KEY, id);
  return id;
};

const hora = (at: number) =>
  new Date(at).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' });

/** Orbe animado que representa al asistente. */
const AssistantOrb = ({ size = 36 }: { size?: number }) => (
  <span className="relative inline-flex shrink-0 items-center justify-center rounded-full" style={{ width: size, height: size }}>
    <motion.span
      className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,var(--color-gold-300),var(--color-gold-600),var(--color-sky-500),var(--color-gold-300))]"
      animate={{ rotate: 360 }}
      transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
    />
    <span className="absolute inset-[2px] rounded-full bg-navy-900" />
    <Sparkles className="relative text-gold-300" style={{ width: size * 0.45, height: size * 0.45 }} />
  </span>
);

const TypingIndicator = () => {
  const [status, setStatus] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setStatus((s) => (s + 1) % TYPING_STATUS.length), 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      className="flex items-end gap-2.5"
    >
      <AssistantOrb size={28} />
      <div className="rounded-2xl rounded-bl-md border border-navy-900/8 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-2 w-2 rounded-full bg-gold-500"
              animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={status}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 text-[11px] text-ink-soft"
          >
            {TYPING_STATUS[status]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [sessionId, setSessionId] = useState(obtenerSesion);
  const [messages, setMessages] = useState<ChatMessage[]>(() => leer(() => sessionStorage, MESSAGES_KEY, []));
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    guardar(() => sessionStorage, MESSAGES_KEY, messages);
  }, [messages]);

  // Burbuja de bienvenida una sola vez por visita
  useEffect(() => {
    if (leer(() => sessionStorage, TEASER_KEY, false)) return;
    const timer = setTimeout(() => setShowTeaser(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 250);
    const onKey = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  // Auto-ajuste de altura del textarea
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

  const abrir = () => {
    setIsOpen(true);
    setShowTeaser(false);
    guardar(() => sessionStorage, TEASER_KEY, true);
  };

  const enviar = useCallback(
    async (texto: string) => {
      const mensaje = texto.trim().slice(0, MAX_LENGTH);
      if (!mensaje || isLoading) return;

      setMessages((prev) => [
        ...prev.filter((m) => !m.error),
        { id: nuevoId(), role: 'user', text: mensaje, at: Date.now() },
      ]);
      setInput('');
      setIsLoading(true);

      try {
        const reply = await chatApi.enviar(sessionId, mensaje);
        setMessages((prev) => [
          ...prev,
          { id: nuevoId(), role: 'assistant', text: reply || 'No tengo una respuesta en este momento. ¿Puedes reformular tu pregunta?', at: Date.now() },
        ]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setMessages((prev) => [
          ...prev,
          {
            id: nuevoId(),
            role: 'assistant',
            text: error?.response?.data?.message || 'No pude conectarme con el asistente. Revisa tu conexión e intenta de nuevo.',
            at: Date.now(),
            error: true,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, sessionId],
  );

  const reintentar = () => {
    const ultimo = [...messages].reverse().find((m) => m.role === 'user');
    if (!ultimo) return;
    setMessages((prev) => prev.filter((m) => !m.error && m.id !== ultimo.id));
    void enviar(ultimo.text);
  };

  const reiniciar = () => {
    const id = nuevoId();
    guardar(() => localStorage, SESSION_KEY, id);
    setSessionId(id);
    setMessages([]);
    setInput('');
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void enviar(input);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void enviar(input);
    }
  };

  const sinMensajes = messages.length === 0;

  return (
    <>
      {/* Panel del chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.section
            role="dialog"
            aria-label="Chat con el asistente de Admisiones"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            style={{ transformOrigin: 'bottom right' }}
            className="fixed inset-0 z-[70] flex flex-col overflow-hidden bg-paper font-body text-ink shadow-[0_30px_80px_-20px_rgba(5,11,20,0.55)] sm:inset-auto sm:bottom-28 sm:right-6 sm:h-[min(660px,calc(100vh-9rem))] sm:w-[410px] sm:rounded-[28px] sm:ring-1 sm:ring-navy-900/10"
          >
            {/* Encabezado */}
            <header className="relative overflow-hidden bg-navy-900 px-5 pb-5 pt-5 text-paper">
              <div className="grain pointer-events-none absolute inset-0" />
              <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-gold-500/25 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-10 h-40 w-40 rounded-full bg-sky-500/25 blur-3xl" />

              <div className="relative flex items-center gap-3">
                <AssistantOrb size={44} />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg leading-tight">Uni · Admisiones UNAC</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-paper/65">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    En línea · Asistente con IA
                  </p>
                </div>
                <button
                  type="button"
                  onClick={reiniciar}
                  title="Nueva conversación"
                  aria-label="Nueva conversación"
                  className="rounded-full p-2 text-paper/70 transition hover:bg-white/10 hover:text-paper"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Cerrar chat"
                  className="rounded-full p-2 text-paper/70 transition hover:bg-white/10 hover:text-paper"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </header>

            {/* Mensajes */}
            <div
              ref={scrollRef}
              aria-live="polite"
              className="flex-1 space-y-4 overflow-y-auto bg-[radial-gradient(circle_at_1px_1px,rgba(11,31,58,0.06)_1px,transparent_0)] bg-[length:18px_18px] px-4 py-5"
            >
              {sinMensajes && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <div className="rounded-3xl border border-navy-900/8 bg-white/90 p-5 shadow-sm backdrop-blur">
                    <span className="eyebrow text-gold-600">Asistente de Admisiones</span>
                    <h3 className="mt-1.5 font-display text-2xl leading-snug text-navy-900">
                      Hola 👋 soy Uni.
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                      Te ayudo a conocer nuestros programas, resolver dudas, <strong className="text-ink">pre-inscribirte</strong> en minutos
                      y enviarte toda la información <strong className="text-ink">a tu WhatsApp</strong>.
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2.5">
                    {QUICK_ACTIONS.map(({ icon: Icon, label, prompt }, i) => (
                      <motion.button
                        key={label}
                        type="button"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + i * 0.06 }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => void enviar(prompt)}
                        className="group flex flex-col items-start gap-2 rounded-2xl border border-navy-900/10 bg-white p-3.5 text-left text-sm font-medium text-navy-900 shadow-sm transition hover:border-gold-500/60 hover:shadow-md"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-navy-900 text-gold-300 transition group-hover:bg-gold-500 group-hover:text-navy-950">
                          <Icon className="h-4 w-4" />
                        </span>
                        {label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              <AnimatePresence initial={false}>
                {messages.map((m) =>
                  m.role === 'user' ? (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="flex flex-col items-end"
                    >
                      <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-gradient-to-br from-navy-800 to-navy-950 px-4 py-2.5 text-sm leading-relaxed text-paper shadow-md">
                        {m.text}
                      </div>
                      <span className="mt-1 pr-1 font-mono text-[10px] text-ink-soft/70">{hora(m.at)}</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="flex items-end gap-2.5"
                    >
                      <AssistantOrb size={28} />
                      <div className="flex max-w-[85%] flex-col">
                        <div
                          className={`break-words rounded-2xl rounded-bl-md border px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                            m.error ? 'border-red-200 bg-red-50 text-red-800' : 'border-navy-900/8 bg-white text-ink'
                          }`}
                        >
                          <ChatMarkdown text={m.text} />
                          {m.error && (
                            <button
                              type="button"
                              onClick={reintentar}
                              className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800 transition hover:bg-red-200"
                            >
                              <RotateCcw className="h-3 w-3" /> Reintentar
                            </button>
                          )}
                        </div>
                        <span className="mt-1 pl-1 font-mono text-[10px] text-ink-soft/70">Uni · {hora(m.at)}</span>
                      </div>
                    </motion.div>
                  ),
                )}
                {isLoading && <TypingIndicator key="typing" />}
              </AnimatePresence>
            </div>

            {/* Compositor */}
            <form onSubmit={onSubmit} className="border-t border-navy-900/8 bg-white/80 px-4 pb-4 pt-3 backdrop-blur">
              <div className="flex items-end gap-2 rounded-2xl border border-navy-900/12 bg-white p-1.5 pl-4 shadow-sm transition focus-within:border-gold-500 focus-within:ring-4 focus-within:ring-gold-500/15">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  maxLength={MAX_LENGTH}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Escribe tu pregunta…"
                  aria-label="Mensaje"
                  className="max-h-[120px] flex-1 resize-none bg-transparent py-2 text-sm text-ink outline-none placeholder:text-ink-soft/60"
                />
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.92 }}
                  disabled={!input.trim() || isLoading}
                  aria-label="Enviar mensaje"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500 text-navy-950 shadow-md transition hover:bg-gold-400 disabled:cursor-not-allowed disabled:bg-navy-900/10 disabled:text-ink-soft/50 disabled:shadow-none"
                >
                  <ArrowUp className="h-5 w-5" />
                </motion.button>
              </div>
              <p className="mt-2 text-center text-[10.5px] text-ink-soft/70">
                Uni usa IA y puede equivocarse. Tus datos solo se usan para tu proceso de admisión.
              </p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Burbuja de bienvenida */}
      <AnimatePresence>
        {showTeaser && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            style={{ transformOrigin: 'bottom right' }}
            className="fixed bottom-28 right-6 z-[60] max-w-[260px]"
          >
            <button
              type="button"
              onClick={abrir}
              className="rounded-2xl rounded-br-md bg-white px-4 py-3 text-left text-sm text-ink shadow-[0_18px_40px_-12px_rgba(5,11,20,0.35)] ring-1 ring-navy-900/10"
            >
              <span className="font-semibold text-navy-900">Hola 👋 soy Uni</span>
              <span className="mt-0.5 block text-ink-soft">¿Te ayudo con tu admisión? Pregúntame lo que quieras.</span>
            </button>
            <button
              type="button"
              aria-label="Ocultar mensaje"
              onClick={() => {
                setShowTeaser(false);
                guardar(() => sessionStorage, TEASER_KEY, true);
              }}
              className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-navy-900 text-paper shadow"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante */}
      <motion.button
        type="button"
        onClick={() => (isOpen ? setIsOpen(false) : abrir())}
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat de Admisiones'}
        aria-expanded={isOpen}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className={`fixed bottom-6 right-6 z-[60] h-16 w-16 rounded-full ${isOpen ? 'hidden sm:block' : ''}`}
      >
        {!isOpen && (
          <span className="absolute inset-0 animate-ping rounded-full bg-gold-500/40 [animation-duration:2.4s]" />
        )}
        <motion.span
          className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,var(--color-gold-300),var(--color-gold-600),var(--color-sky-500),var(--color-gold-300))] shadow-[0_14px_34px_-8px_rgba(212,166,42,0.65)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        <span className="absolute inset-[3px] flex items-center justify-center rounded-full bg-navy-900">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isOpen ? 'cerrar' : 'abrir'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {isOpen ? <X className="h-6 w-6 text-paper" /> : <Sparkles className="h-6 w-6 text-gold-300" />}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.button>
    </>
  );
};
