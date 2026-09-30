import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookOpen, CheckCircle2, MessageCircle, PhoneCall } from "lucide-react";

import { saveEbookLead } from "@/lib/ebook-lead.functions";

import michaelPortrait from "@/assets/IMG_4569.jpeg.asset.json";
import michaelWelcome from "@/assets/IMG_4565.jpeg.asset.json";
import bookLaunch from "@/assets/IMG_0360.jpeg.asset.json";
import bookDisplay from "@/assets/IMG_0359.jpeg.asset.json";
import officeBackground from "@/assets/commercial-strategy-background.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Confirme sua conversa estratégica | Michael Almeida" },
      {
        name: "description",
        content:
          "Confirme sua conversa estratégica com Michael Almeida e prepare-se para identificar os próximos passos do seu comercial.",
      },
      { property: "og:title", content: "Sua conversa está reservada | Michael Almeida" },
      {
        property: "og:description",
        content: "Confirme seu horário e receba as orientações para sua conversa estratégica.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const whatsappLink = "https://wa.me/";

const testimonials = [
  {
    quote:
      "Em 2019, contratamos Michael para mentorar os líderes e vendedores da empresa. O resultado foi tão expressivo que o contrato de 6 meses foi prorrogado por mais 6.",
    name: "Eliane Santos",
    role: "Gerente Comercial",
  },
  {
    quote:
      "A atuação e orientação do Michael foram determinantes para que pudéssemos criar do zero e profissionalizar o nosso departamento comercial.",
    name: "Cadri Awad",
    role: "Diretor Executivo, Instituto Bulla",
  },
  {
    quote:
      "O processo envolveu a escolha de CRM, contratação de pessoas e implementação de metodologia de vendas. A expertise do Michael foi fundamental para o crescimento do nosso negócio.",
    name: "Fabrício Santos",
    role: "Diretor Comercial, Hipermat",
  },
  {
    quote:
      "O treinamento foi ótimo, superando todas as expectativas minhas e de todo o time comercial. Michael é uma pessoa que realmente conhece de vendas.",
    name: "Marcos Lopes",
    role: "Diretor Comercial",
  },
  {
    quote:
      "Michael ministrou, num sábado, um treinamento com uma didática incrível, trazendo muita técnica e motivação ao mesmo tempo. Conseguiu, de forma leve, prender a atenção de todos durante o dia inteiro.",
    name: "Camila Gouveia",
    role: "Coordenadora de Vendas",
  },
  {
    quote:
      "Ele não só elevou o conhecimento dos vendedores como nos orientou nos pilares de cultura, gestão, tecnologia e pessoas para termos mais resultados.",
    name: "Leandro Klüber",
    role: "Diretor de Operações",
  },
];

function ConfirmationLink({ label = "Confirmar meu horário" }: { label?: string }) {
  return (
    <a className="confirmation-button" href={whatsappLink} target="_blank" rel="noreferrer">
      <MessageCircle aria-hidden="true" size={18} />
      <span>{label}</span>
      <ArrowRight aria-hidden="true" size={18} />
    </a>
  );
}

type EbookStatus = "idle" | "sending" | "done" | "error";

function EbookForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<EbookStatus>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (cleanName.length < 2) return setError("Digite seu nome.");
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) return setError("Digite um e-mail válido.");
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13) return setError("Digite um telefone válido com DDD.");

    setStatus("sending");
    try {
      await saveEbookLead({ data: { name: cleanName, phone: phone.trim(), email: cleanEmail } });
      setStatus("done");
    } catch {
      setStatus("error");
      setError("Não foi possível enviar agora. Tente de novo em instantes.");
    }
  }

  if (status === "done") {
    return (
      <div className="ebook-card ebook-done" role="status">
        <CheckCircle2 aria-hidden="true" size={34} />
        <h3>Prontinho, {name.trim()}!</h3>
        <p>Recebemos seus dados. O ebook vai chegar no seu e-mail e no seu WhatsApp.</p>
      </div>
    );
  }

  return (
    <form className="ebook-card" onSubmit={handleSubmit} noValidate>
      <div className="ebook-field">
        <label htmlFor="ebook-name">Nome</label>
        <input
          id="ebook-name"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={100}
          placeholder="Seu nome"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>
      <div className="ebook-field">
        <label htmlFor="ebook-phone">Telefone</label>
        <input
          id="ebook-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          maxLength={20}
          placeholder="(71) 90000-0000"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
        />
      </div>
      <div className="ebook-field">
        <label htmlFor="ebook-email">E-mail</label>
        <input
          id="ebook-email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={255}
          placeholder="voce@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      {error ? <p className="ebook-error" role="alert">{error}</p> : null}
      <button className="confirmation-button ebook-submit" type="submit" disabled={status === "sending"}>
        <BookOpen aria-hidden="true" size={18} />
        <span>{status === "sending" ? "Enviando..." : "Quero meu ebook grátis"}</span>
        <ArrowRight aria-hidden="true" size={18} />
      </button>
      <span className="ebook-note">Seus dados estão seguros. Sem spam.</span>
    </form>
  );
}

function Index() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <section className="hero-section">
        <img
          src={officeBackground}
          alt="Escritório executivo preparado para uma conversa estratégica"
          className="hero-background"
          width={1536}
          height={1024}
        />
        <div className="hero-shade" />
        <div className="site-container hero-grid">
          <div className="hero-content">
            <div className="progress-label">
              <span>Etapa 2 de 3</span>
              <strong>72%</strong>
            </div>
            <div className="progress-track" aria-label="Progresso: 72%">
              <span />
            </div>

            <p className="eyebrow">Sua conversa está reservada</p>
            <h1>Falta só <em>confirmar.</em></h1>
            <p className="hero-copy">
              Manda um oi no WhatsApp confirmando, que eu deixo o seu horário garantido e me preparo pra nossa conversa.
            </p>

            <div className="notice-list">
              <div className="notice-item">
                <MessageCircle aria-hidden="true" />
                <p>Envie uma mensagem confirmando pelo botão abaixo.</p>
              </div>
              <div className="notice-item">
                <PhoneCall aria-hidden="true" />
                <p>Confira se o WhatsApp cadastrado está certo. É por ele que vamos falar com você.</p>
              </div>
              <div className="notice-item">
                <Clock3 aria-hidden="true" />
                <p>Sem retorno em até 24h úteis, nossa equipe tenta um contato por ligação.</p>
              </div>
            </div>

            <ConfirmationLink label="Confirmar no WhatsApp" />
            <span className="microcopy">Leva menos de 1 minuto</span>
          </div>

          <div className="hero-person" aria-hidden="true">
            <div className="portrait-glow" />
            <img src={michaelPortrait.url} alt="" width={960} height={1280} />
          </div>
        </div>
      </section>

      <section className="process-section">
        <div className="site-container">
          <div className="section-heading centered-heading">
            <p className="eyebrow">Sem burocracia</p>
            <h2>Como funciona daqui pra frente</h2>
          </div>
          <div className="steps-grid">
            <article className="step-item complete">
              <span className="step-number">01</span>
              <div className="step-status"><Check size={14} /> Concluído</div>
              <h3>Aplicação</h3>
              <p>Você respondeu e reservou um horário. Já foi a parte mais chata.</p>
            </article>
            <article className="step-item current">
              <span className="step-number">02</span>
              <div className="step-status">Você está aqui</div>
              <h3>Confirmação</h3>
              <p>Você confirma pelo WhatsApp e recebe um mini checklist do que ter em mãos.</p>
            </article>
            <article className="step-item">
              <span className="step-number">03</span>
              <div className="step-status">Próximo passo</div>
              <h3>Conversa estratégica</h3>
              <p>Uma conversa individual sobre o momento comercial do seu negócio e o caminho mais simples pra vender mais.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="diagnosis-section">
        <div className="site-container diagnosis-grid">
          <div className="diagnosis-intro">
            <p className="eyebrow">Diagnóstico de verdade</p>
            <h2>O que a gente vai ver juntos</h2>
            <p>Não é uma apresentação de vendas. É uma conversa de diagnóstico, no seu ritmo.</p>
            <img src={michaelWelcome.url} alt="Michael Almeida dando boas-vindas" width={960} height={1280} loading="lazy" />
          </div>
          <ol className="topics-list">
            <li><span>01</span><div><h3>Como o seu comercial funciona hoje</h3><p>Começamos pelo que já dá certo. Tem muita coisa boa que só precisa de direção.</p></div></li>
            <li><span>02</span><div><h3>Onde as vendas estão travando</h3><p>Processo, time, abordagem e ferramentas: onde está o gargalo de verdade.</p></div></li>
            <li><span>03</span><div><h3>O caminho que eu sugiro</h3><p>Um plano simples, explicado em linguagem de conversa, sem termo difícil.</p></div></li>
            <li><span>04</span><div><h3>Próximo passo, sem pressão</h3><p>Se fizer sentido, a gente conversa sobre como seguir. Se não fizer, você sai com o diagnóstico na mão.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="book-section">
        <div className="site-container book-grid">
          <div className="book-collage">
            <img src={bookDisplay.url} alt="Michael Almeida no lançamento do livro Vender é Minha Arte" width={960} height={1280} loading="lazy" />
            <img src={bookLaunch.url} alt="Michael Almeida apresentando seu livro durante o lançamento" width={960} height={1280} loading="lazy" />
          </div>
          <div className="book-copy">
            <p className="eyebrow">Experiência que vira método</p>
            <h2>Vender é minha arte</h2>
            <p className="lead">Uma trajetória dedicada a transformar conhecimento comercial em processos simples, humanos e aplicáveis.</p>
            <p>O lançamento do livro marca uma história construída ao lado de líderes, vendedores e empresas que decidiram profissionalizar suas vendas.</p>
            <div className="book-detail"><span>Livro</span><strong>Vender é Minha Arte</strong></div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="site-container">
          <div className="section-heading">
            <p className="eyebrow">Resultados reais</p>
            <h2>Quem já passou pelo processo</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <article className={index === 0 ? "testimonial featured" : "testimonial"} key={testimonial.name}>
                <span className="quote-mark">“</span>
                <blockquote>{testimonial.quote}</blockquote>
                <footer><strong>{testimonial.name}</strong><span>{testimonial.role}</span></footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="final-section">
        <div className="site-container final-inner">
          <p className="eyebrow">Seu horário está reservado</p>
          <h2>Vamos conversar sobre o próximo passo do seu negócio?</h2>
          <ConfirmationLink />
        </div>
      </section>

      <section className="ebook-section">
        <div className="site-container ebook-grid">
          <div className="ebook-intro">
            <p className="eyebrow">Bônus gratuito</p>
            <h2>Ganhe o ebook grátis</h2>
            <p className="ebook-copy">
              Deixe seu nome, telefone e e-mail para receber o ebook do Michael. É rápido — e em
              seguida a gente já confirma sua conversa pelo WhatsApp.
            </p>
            <ul className="ebook-benefits">
              <li><CheckCircle2 aria-hidden="true" />Método comercial em linguagem simples</li>
              <li><CheckCircle2 aria-hidden="true" />Leitura rápida, feita pra aplicar hoje</li>
              <li><CheckCircle2 aria-hidden="true" />Grátis, sem compromisso</li>
            </ul>
          </div>
          <EbookForm />
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-container"><span>Michael Almeida</span><p>Estratégia comercial com clareza, método e direção.</p></div>
      </footer>
    </main>
  );
}