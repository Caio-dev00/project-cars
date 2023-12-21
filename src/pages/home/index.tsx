import { Container } from "../../components/container"

export function Home() {
  return (
    <Container>
        <section className="bg-white p-4 drop-shadow-md rounded-lg w-full mx-auto flex justify-center gap-2">
          <input
            className="w-full border-2 rounded-lg h-9 px-3 outline-none"
            placeholder="Digite o nome do carro..."
          />
          <button className="bg-blue-900 px-8 h-9 rounded-lg text-white font-medium">
            Buscar
          </button>
        </section>

        <h1 className="text-center mt-20 font-bold text-2xl mb-4">
          Carros novo e usados em todo o Brasil
        </h1>

        <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            
          <section className="w-full bg-white rounded-lg">
            <img 
              className="w-full rounded-lg mb-2 max-h-80 hover:scale-105 transition-all"
              src="https://image.webmotors.com.br/_fotos/anunciousados/gigante/2023/202312/20231220/bmw-320i-2.0-16v-turbo-flex-sport-gp-automatico-wmimagem19350267212.jpg?s=fill&w=1920&h=1440&q=75" 
              alt="Carro BMW" 
            />
            <p className="font-bold mt-1 mb-2 px-2">BMW 320i</p>
            <div className="flex flex-col px-2">
              <span className="text-zinc-700 mb-6">Ano 2016/2016 | 23.000Km</span>
              <strong className="text-black font-medium text-xl">R$ 215.000</strong>
            </div>

            <div className="w-full h-px bg-slate-200 my-2"></div>

            <div className="px-2 pb-2">
              <span className="text-zinc-700">Sao Paulo - SP</span>
            </div>
          </section>

        </main>
    </Container>
    
  )
}
