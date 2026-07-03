export default function Footer() {
  return (
    <footer className="bg-background text-text py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <img src="/logo.png" alt="WorkLink" className="h-12 mb-4" />

            <p className="text-text-muted">
              Plataforma que conecta talento local con empresas y oportunidades.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-text">Plataforma</h3>

            <ul className="space-y-2 text-text-muted">
              <li>Servicios</li>
              <li>Empleos</li>
              <li>Empresas</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-text">Recursos</h3>

            <ul className="space-y-2 text-text-muted">
              <li>Ayuda</li>
              <li>Preguntas frecuentes</li>
              <li>Contacto</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-text">Legal</h3>

            <ul className="space-y-2 text-text-muted">
              <li>Términos</li>
              <li>Privacidad</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-text-muted">
          © 2026 WorkLink. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}