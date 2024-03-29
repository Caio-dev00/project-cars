import { ChangeEvent, useContext, useState } from "react"
import { Container } from "../../../components/container"
import { DashboardHeader } from "../../../components/panelheader"

import { FiTrash, FiUpload } from "react-icons/fi"
import { useForm } from 'react-hook-form'
import { Input } from "../../../components/input"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { AuthContext } from "../../../contexts/AuthContext"
import { v4 as uuidV4 } from 'uuid'

import { storage, db } from "../../../services/firebaseConnection"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { addDoc, collection } from 'firebase/firestore'

import toast from "react-hot-toast"

const schema = z.object({
  name: z.string().min(1, "O campo nome é obrigatório"),
  model: z.string().min(1, "O modelo é obrigatório"),
  year: z.string().min(1, "O ano do carro é obrigatório"),
  km: z.string().min(1, "O KM do carro é obrigatório"),
  price: z.string().min(1, "O preço é obrigatório"),
  city: z.string().min(1, "A cidade é obrigatória"),
  zap: z.string().min(1, "O telefone é obrigatório").refine((value)=> /^(\d{10,12})$/.test(value), {
    message: "Numero de telefone invalido."
  }),
  description: z.string().min(1, "A descrição é obrigatória")
})

type FormData = z.infer<typeof schema>;

interface ImageItemProps{
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
}

export function New() {
  const { user } = useContext(AuthContext)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  const [carImages, setCarImages] = useState<ImageItemProps[]>([])

  function onSubmit(data: FormData){
    if(carImages.length === 0){
      toast.error("Envie pelo menos 1 imagem")
      return;
    }

    const carListImages = carImages.map(car => {
      return{
        uid: car.uid,
        name: car.name.toUpperCase(),
        url: car.url
      }
    })

    addDoc(collection(db, "cars"), {
      name: data.name.toUpperCase(),
      model: data.model,
      whatsapp: data.zap,
      city: data.city,
      year: data.year,
      km: data.km,
      price: data.price,
      description: data.description,
      created: new Date(),
      owner: user?.name,
      uid: user?.uid,
      images: carListImages,
    })
    .then(() => {
      reset();
      setCarImages([]);
      toast.success("Carro cadastrado com sucesso!")
      console.log("CADASTRADO COM SUCESSO!")
    })
    .catch((error) => {
      console.log(error)
      toast.error("Erro ao cadstrar carro!")
      console.log("ERRO AO CADASTRAR NO BANCO!")
    })


  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>){
    if(e.target.files && e.target.files[0]){
      const image = e.target.files[0]

      if(image.type === "image/jpeg" || image.type === "image/png"){
        await handleUpload(image)
      }else{
        alert("Envie uma imagem jpeg ou png!")
        return;
      }
    }
  }

  async function handleUpload(image: File){
    if(!user?.uid){
      return;
    }

    const currentUid = user?.uid;
    const uidImage = uuidV4();

    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`)

    uploadBytes(uploadRef, image)
    .then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        const imageItem = {
          name: uidImage,
          uid: currentUid,
          previewUrl: URL.createObjectURL(image),
          url: downloadUrl,
        }
        setCarImages((images) => [...images, imageItem])
      })
    })

  }

  async function handleDeleteImage(item: ImageItemProps){
    const imagePath = `images/${item.uid}/${item.name}`;
    const imageRef = ref(storage, imagePath)

    try{
      await deleteObject(imageRef)
      setCarImages(carImages.filter((car) => car.url !== item.url))
    }catch(err){
      console.log("ERRO AO DELETAR")
    }
  }

  return (
    <Container>
        <DashboardHeader/>

        <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
            <button 
            className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
                <div className="absolute cursor-pointer">
                  <FiUpload size={30} color="#000" />
                </div>
                <div className="cursor-pointer">
                  <input 
                  className="opacity-0 cursor-pointer" 
                  onChange={handleFile} 
                  type="file" 
                  accept="image/*"/>
                </div>
            </button>

            {carImages.map( item => (
              <div className="w-full h-32 flex items-center justify-center relative" key={item.name}>
                  <button className="absolute" onClick={()=> handleDeleteImage(item)}>
                    <FiTrash size={28} color="#FFF"/>
                  </button>
                  <img 
                  src={item.previewUrl}
                  className="rounded-lg w-full h-32 object-cover"
                  />
              </div>
            ))}

        </div>

        <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
            <form 
            onSubmit={handleSubmit(onSubmit)}
            className="w-full"
            >
              <div className="bm-3">
                <p className="mb-2 font-medium">Nome do carro</p>
                <Input
                  type="text"
                  register={register}
                  name="name"
                  error={errors.name?.message}
                  placeholder="Ex: Onix 1.0..."
                />
              </div>

              <div className="bm-3">
                <p className="mb-2 font-medium">Modelo do carro</p>
                <Input
                  type="text"
                  register={register}
                  name="model"
                  error={errors.model?.message}
                  placeholder="Ex: 10.2 Flex PLUS MANUAl..."
                />
              </div>

              <div className="flex w-full mb-3 flex-row items-center gap-4">
                <div className="w-full">
                  <p className="mb-2 font-medium">Ano do carro</p>
                  <Input
                    type="text"
                    register={register}
                    name="year"
                    error={errors.year?.message}
                    placeholder="Ex: 2016/2016..."
                  />
                </div>

                <div className="w-full">
                  <p className="mb-2 font-medium">KM rodados</p>
                  <Input
                    type="text"
                    register={register}
                    name="km"
                    error={errors.km?.message}
                    placeholder="Ex: 255.000..."
                  />
                </div>
              </div>

              <div className="flex w-full mb-3 flex-row items-center gap-4">
                <div className="w-full">
                  <p className="mb-2 font-medium">Telefone / Whtasapp</p>
                  <Input
                    type="text"
                    register={register}
                    name="zap"
                    error={errors.zap?.message}
                    placeholder="Ex: 01197165121..."
                  />
                </div>

                <div className="w-full">
                  <p className="mb-2 font-medium">Cidade</p>
                  <Input
                    type="text"
                    register={register}
                    name="city"
                    error={errors.city?.message}
                    placeholder="Ex: São Paulo - SP..."
                  />
                </div>
              </div>

              <div className="mb-3">
                  <p className="mb-2 font-medium">Preço</p>
                  <Input
                    type="text"
                    register={register}
                    name="price"
                    error={errors.price?.message}
                    placeholder="Ex: R$55.000"
                  />
              </div>

              <div className="mb-3">
                  <p className="mb-2 font-medium">Descrição</p>
                  <textarea
                    className="w-full border-2 rounded-md h-24 px-2"
                    {...register("description")}
                    name="description"
                    id="description"
                    placeholder="Digita a descrição sobre o carro"
                  />
                  {errors.description && <p className="mb-1 text-red-500">{errors.description.message}</p>}
              </div>

              <button type="submit" className="w-full h-10 rounded-md bg-zinc-900 text-white font-medium">
                  Cadastrar
              </button>

            </form>
        </div>
    </Container>
  )
}
