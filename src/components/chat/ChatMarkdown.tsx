import { Fragment, type ReactNode } from 'react';

// Markdown mínimo y seguro (sin innerHTML): **negrita**, *negrita*, enlaces, correos y listas
const INLINE = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g;

const renderInline = (texto: string): ReactNode[] =>
  texto.split(INLINE).map((parte, i) => {
    if (!parte) return null;
    if (parte.startsWith('**') && parte.endsWith('**'))
      return <strong key={i} className="font-semibold">{parte.slice(2, -2)}</strong>;
    if (parte.length > 2 && parte.startsWith('*') && parte.endsWith('*'))
      return <strong key={i} className="font-semibold">{parte.slice(1, -1)}</strong>;
    if (/^https?:\/\//.test(parte))
      return (
        <a key={i} href={parte} target="_blank" rel="noreferrer" className="break-all underline decoration-gold-500/60 underline-offset-2 hover:decoration-gold-500">
          {parte}
        </a>
      );
    if (/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(parte))
      return (
        <a key={i} href={`mailto:${parte}`} className="underline decoration-gold-500/60 underline-offset-2 hover:decoration-gold-500">
          {parte}
        </a>
      );
    return <Fragment key={i}>{parte}</Fragment>;
  });

export const ChatMarkdown = ({ text }: { text: string }) => {
  const lineas = text.split('\n');
  const bloques: ReactNode[] = [];
  let lista: { ordenada: boolean; items: string[] } | null = null;

  const cerrarLista = () => {
    if (!lista) return;
    const Tag = lista.ordenada ? 'ol' : 'ul';
    bloques.push(
      <Tag key={`l${bloques.length}`} className={`my-1.5 space-y-1 pl-5 ${lista.ordenada ? 'list-decimal' : 'list-disc'} marker:text-gold-600`}>
        {lista.items.map((item, i) => <li key={i}>{renderInline(item)}</li>)}
      </Tag>,
    );
    lista = null;
  };

  lineas.forEach((linea) => {
    const vineta = linea.match(/^\s*[-•*]\s+(.*)$/);
    const numerada = linea.match(/^\s*\d+[.)]\s+(.*)$/);
    if (vineta || numerada) {
      const ordenada = !!numerada;
      if (lista && lista.ordenada !== ordenada) cerrarLista();
      lista ??= { ordenada, items: [] };
      lista.items.push((vineta ?? numerada)![1]);
      return;
    }
    cerrarLista();
    if (linea.trim() === '') return;
    bloques.push(<p key={`p${bloques.length}`} className="my-1 first:mt-0 last:mb-0">{renderInline(linea)}</p>);
  });
  cerrarLista();

  return <>{bloques}</>;
};
