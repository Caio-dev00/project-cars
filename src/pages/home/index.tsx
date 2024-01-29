import { useState, useEffect } from "react"
import { Container } from "../../components/container"

import { collection, query, getDocs, orderBy, where } from "firebase/firestore"
import { db } from "../../services/firebaseConnection"
import { Link } from "react-router-dom"


interface CarsProps {
  id: string,
  name: string,
  year: string,
  uid: string,
  price: string | number,
  city: string,
  km: string,
  images: CarImageProps[],
}

interface CarImageProps{
  name: string,
  uid: string,
  url: string,
}

export function Home() {

  const [cars, setCars] = useState<CarsProps[]>([])
  const [loadImages, setLoadImages] = useState<string[]>([])
  const [input, setInput] = useState("")

  useEffect(() => {
    loadCars();  
  },[])

  function loadCars(){
    const carsRef = collection(db, "cars")
    const queryRef = query(carsRef, orderBy("created", "desc"))

    getDocs(queryRef)
    .then((snapshot) => {
      const listCars = [] as CarsProps[]


      snapshot.forEach( doc => {
        listCars.push({
          id: doc.id,
          name: doc.data().name,
          year: doc.data().year,
          city: doc.data().city,
          km: doc.data().km,
          price: doc.data().price,
          images: doc.data().images,
          uid: doc.data().uid
        })
      })
      setCars(listCars);
    })
  }

  function handleImageLoad(id: string){
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id])
  }

  async function handleSearchCar(){
    if(input === ""){
      loadCars();
      return;
    }

    setCars([]);
    setLoadImages([]);

    const q = query(collection(db, "cars"), 
    where("name", ">=", input.toUpperCase()),
    where("name", "<=", input.toUpperCase() + "\uf8ff")
    )

    const querySnapshot = await getDocs(q)

    const listCars = [] as CarsProps[];

    querySnapshot.forEach((doc) => {
      listCars.push({
        id: doc.id,
        name: doc.data().name,
        year: doc.data().year,
        city: doc.data().city,
        km: doc.data().km,
        price: doc.data().price,
        images: doc.data().images,
        uid: doc.data().uid
      })
    })

    setCars(listCars)
  }
  

  return (
    <Container>
        <section className="bg-white p-4 drop-shadow-md rounded-lg w-full mx-auto flex justify-center gap-2">
          <input
            className="w-full border-2 rounded-lg h-9 px-3 outline-none"
            placeholder="Digite o nome do carro..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
          className="bg-blue-900 px-8 h-9 rounded-lg text-white font-medium"
          onClick={handleSearchCar}
          >
            Buscar
          </button>
        </section>

        <h1 className="text-center mt-20 font-bold text-2xl mb-4">
          Carros novos e usados em todo o Brasil
        </h1>

        <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            
         {cars.map( cars => (
            <Link key={cars.id} to={`/car/${cars.id}`}>
              <section className="w-full bg-white rounded-lg" >
                <div 
                className="w-full h-72 rounded-lg bg-slate-200"
                style={{ display: loadImages.includes(cars.id) ? "none" : "block"}}
                >
              
                </div>
              <img 
                className="w-full rounded-lg mb-2 max-h-80 hover:scale-105 transition-all"
                src={cars.images[0].url} 
                alt={cars.name} 
                onLoad={() => handleImageLoad(cars.id)}
                style={{ display: loadImages.includes(cars.id) ? "block" : "none" }}
              />
              <p className="font-bold mt-1 mb-2 px-2">{cars.name}</p>
              <div className="flex flex-col px-2">
                <span className="text-zinc-700 mb-6">Ano {cars.year} | {cars.km}Km</span>
                <strong className="text-black font-medium text-xl">R$ {cars.price}</strong>
              </div>

              <div className="w-full h-px bg-slate-200 my-2"></div>

              <div className="px-2 pb-2">
                <span className="text-zinc-700">{cars.city}</span>
              </div>
          </section>
            </Link>
         ))}

        </main>
    </Container>
    
  )
}
