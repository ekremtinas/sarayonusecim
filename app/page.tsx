"use client";

import {  useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore,collection,getDocs,addDoc,doc,updateDoc} from "@firebase/firestore"
import { deleteDoc } from "firebase/firestore";


export default function Home() {

  const [isAdmin, setIsAdmin] = useState(true);
  console.log(isAdmin)
  const firebaseConfig = {
    apiKey: "AIzaSyDQbf3tbDFUS6nvc84o116PN9MIWe4r7Tk",
    authDomain: "muhtarliksecim.firebaseapp.com",
    projectId: "muhtarliksecim",
    storageBucket: "muhtarliksecim.appspot.com",
    messagingSenderId: "774918961056",
    appId: "1:774918961056:web:e4ecb45d59e46a1bf2d6c5",
    measurementId: "G-F90C942RRY"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const CollectionRef = collection(db, "muhtarliksecim")



  const getUsersData = async () => {
    const data = await getDocs(CollectionRef);
    let list = data.docs.map((elem:any) => ({ ...elem.data(), id: elem.id }));
    list = list.sort((a:any, b:any) => a.sandikNo - b.sandikNo);
    setSandiklar(list)
  }

  useEffect(() => {
    setInterval(() => {
    getUsersData()
    }, 1000);
}, [])


  const [sorumlu, setSorumlu] = useState("");
  const [sandikNo, setSandikNo] = useState("");
  const [oySayisi, setOySayisi] = useState(0);
  const [sandiklar, setSandiklar] = useState<any>([]);

const update =async(id:any,oySayisi:any)=>{
  const sandikDoc = doc(db, "muhtarliksecim", id);
  console.log(sandikDoc)
  const newReg = { oySayisi}
  console.log("Updated the Data on System")
  await updateDoc(sandikDoc, newReg)
  console.log("Updated the Data on the Server")
}

  const oySayisiGuncelle = (id:any, oySayisi:any) => {
    setSandiklar(sandiklar.map((sandik:any) => {
      if (sandik.id === id) {
        update(id,oySayisi);


        return { ...sandik, oySayisi };


        
      } else {
        return sandik;
      }
    }));
  };


  const sandikEkle =async()=>{
    setSandiklar([...sandiklar, { sandikNo, sorumlu, oySayisi }]);
    await addDoc(CollectionRef, { sandikNo, sorumlu, oySayisi });
    setSorumlu("");
    setSandikNo("");
    setOySayisi(0);
    
  }
  const sandikSil =async(id:any)=>{
    setSandiklar(sandiklar.filter((s:any) => s.id !==id));
    const sandikDoc = doc(db, "muhtarliksecim", id);
    console.log(sandikDoc)
    await deleteDoc(sandikDoc)
    console.log("Updated the Data on the Server")
  }
  console.log(sandiklar)
  return (
    <main className="flex  flex-col items-center justify-between p-24">
       
        <h2 style={{textAlign:"center",fontSize:20}}><b>MUSTAFA TINAS</b></h2>
        <br></br>
        <h2 style={{textAlign:"center",fontSize:20}}><b>Ladik Mahallesi Seçim Sandık Kayıtları</b></h2>
        <br></br>
        <h2 style={{textAlign:"center",fontSize:20}}><b>
          Toplam:{ 
          sandiklar.reduce((acc:any, sandik:any) => acc + sandik.oySayisi, 0)
          }</b></h2>
        <br></br>
          <div style={{color:"red",fontWeight:"bold"}}>!!!Sandık görevlileri harici lütfen oy sayısını değiştirmeyiniz.</div>
        <br></br>
        <br></br>
        

        <div className="table-container">
        <table>
        <thead>
          <tr>
            <th>Sorumlu</th>
            <th>Sandık No</th>
            <th>Oy Sayısı</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sandiklar.map((sandik:any) => (
            <tr key={sandik.sandikNo}>

              <td>{sandik.sorumlu}</td>
              <td>{sandik.sandikNo}</td>
              <td style={{textAlign:"justify"}}>
                <input style={{textAlign:"center"}} readOnly={!isAdmin} type="number" value={sandik.oySayisi} onChange={e => oySayisiGuncelle(sandik.id, parseInt(e.target.value))} />
                
              </td>
              <td>
              <button hidden={true} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
                 sandikSil(sandik.id);
                }}>Sil</button>
                <br></br>
                <br></br>
              </td>
            </tr>
          ))}
          <tr hidden={!isAdmin}>
            <td  >
              <input type="text" value={sorumlu} onChange={(e:any)=>setSorumlu(String(e.target.value))} placeholder="Sorumlu" />
              </td>
              <td>
              <input type="text" value={sandikNo} onChange={(e:any)=>setSandikNo(String(e.target.value))}   placeholder="Sandık No" />
              </td>
              <td>
              <input type="number"  value={oySayisi} onChange={(e:any)=>setOySayisi(Number(e.target.value))} placeholder="Oy Sayısı" />
              </td>
              <td>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={sandikEkle}>Ekle</button>
                </td>
             
          </tr>
        </tbody>
      </table>
      </div>

      <br></br>
      <br></br>
      Silme ve Güncelle için 05423725116 numaralı telefondan ulaşabilirsiniz.
    </main>
  );
}
