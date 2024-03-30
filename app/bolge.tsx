import { initializeApp } from 'firebase/app';
import { set } from 'firebase/database';
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore } from 'firebase/firestore';
import React, {  useEffect, useState } from 'react'

const Bolge = ({onSetBolgeler}:{onSetBolgeler:any}) => {
    const firebaseConfig = {
        apiKey: "AIzaSyDhmSbsrmWILDt6EXehO9sJO9WRICMovQE",
        authDomain: "sarayonusecim.firebaseapp.com",
        projectId: "sarayonusecim",
        storageBucket: "sarayonusecim.appspot.com",
        messagingSenderId: "871209063295",
        appId: "1:871209063295:web:a1dcb4803ae5e28ea1004a",
        measurementId: "G-FFZM01LF6M"
      };
        
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const CollectionRef = collection(db, "bolgeler")
        const [bolge, setBolge] = useState<any>([]);
        const [render,setRender] = useState<any>("");
        useEffect(() => {
            const fetchData = async () => {
              const data = await getDocs(CollectionRef);
              let list = data.docs.map((doc:any) => ({ ...doc.data(), id: doc.id }));
                onSetBolgeler(list)
              setBolge(list);
            };
            fetchData();
          }
            , [render]);
        const [bolgeAdi, setBolgeAdi] = useState<string>("");
        const [sorumlu, setSorumlu] = useState<string>("");
        const bolgeEkle = async () => { 
            const data = {
                bolgeAdi,
                sorumlu
            }
            const docRef = await addDoc(CollectionRef, data);
            console.log("Document written with ID: ", docRef.id);
            setBolge([...bolge, {bolgeAdi, sorumlu}]);
            setRender(Math.random());
        }
        const bolgeSil = async (id:string) => {
            const bolgeDoc = doc(db, "bolgeler", id);
            console.log(bolgeDoc)
            await deleteDoc(bolgeDoc)
            console.log("Updated the Data on the Server")
            setBolge(bolge.filter((item:any) => item.id !== id));
            setRender(Math.random());
        }
        
  return (
    <div>
        <h1>Bölge Sayfası</h1>
         
        <ul>
            {bolge.map((item:any) => (
                <li key={item.id}>{item.sorumlu} - {item.bolgeAdi}    <button style={{marginLeft:20}} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={()=>bolgeSil(item.id)}>Sil</button></li>
            ))}
        </ul>
        <input type="text" value={sorumlu} onChange={(e)=>setSorumlu(e.target.value)} placeholder="Sorumlu" />
        <input style={{marginLeft:5}} type="text" value={bolgeAdi} onChange={(e)=>setBolgeAdi(e.target.value)} placeholder="Bölge Adı" />
        <button style={{marginLeft:20}} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={bolgeEkle}>Ekle</button>
        <br></br>
        <br></br>
        <br></br>
    </div>
  )
}

export default Bolge