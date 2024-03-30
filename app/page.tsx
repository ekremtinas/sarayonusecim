"use client";

import {  useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore,collection,getDocs,addDoc,doc,updateDoc} from "@firebase/firestore"
import { deleteDoc } from "firebase/firestore";
import Bolge from "./bolge";


export default function Home() {

  const [isAdmin, setIsAdmin] = useState(true);
  console.log(isAdmin)

 //!Yeni Firebase Config
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
  const CollectionRef = collection(db, "sarayonusecim")



  const getUsersData = async () => {
    const data = await getDocs(CollectionRef);
    let list = data.docs.map((elem:any) => ({ ...elem.data(), id: elem.id }));
    list = list.sort((a:any, b:any) => a.sandikNo - b.sandikNo);
    setSandiklar(list)
  }
const [render, setRender] = useState("0");

  useEffect(() => {
    setInterval(() => {
    getUsersData()
    }, 180000);
}, [])

useEffect(() => {
  getUsersData()
}
, [render]);

  const [sandiklar, setSandiklar] = useState<any>([]);





  const [minute, setMinute] = useState(180);
  useEffect(() => {
    const interval = setInterval(() => {
      setMinute(minute - 1);
    }, 1000);
    if (minute === 0) {
      setMinute(180);
      getUsersData()
    }
    return () => clearInterval(interval);
  }, [minute]);


  const [bolgeler,setBolgeler] = useState<any>([{}]);
  const onSetBolgeler = (bolgeler:any) => {
    if (bolgeler.length === 0) {
      setIsAdmin(false);
    } else {
      setBolgeler(bolgeler);
      setIsAdmin(true);
    }
  }

  return (
    <main className="flex  flex-col items-center justify-between p-24">
       
        <h2 style={{textAlign:"center",fontSize:20}}><b>NECATİ KOÇ - YENİDEN REFAH</b></h2>
        <br></br>
        <h2 style={{textAlign:"center",fontSize:20}}><b>Sarayönü İlçesi Seçim Sandık Kayıtları</b></h2>
        <br></br>
        <h2 style={{textAlign:"center",fontSize:20}}><b>
          Refah Toplam:{ 
          sandiklar.reduce((acc:any, sandik:any) => acc + Number(sandik.refahOySayisi), 0)
          }</b></h2>
        <h2 style={{textAlign:"center",fontSize:20}}><b>
          Akp Toplam:{ 
          sandiklar.reduce((acc:any, sandik:any) => acc + Number(sandik.akpOySayisi), 0)
          }</b></h2>
        <h2 style={{textAlign:"center",fontSize:20}}><b>
          Bagimsiz Toplam:{ 
          sandiklar.reduce((acc:any, sandik:any) => acc + Number(sandik.bagimsizOySayisi), 0)
          }</b></h2>
        <h2 style={{textAlign:"center",fontSize:20}}><b>
          Diğer Toplam:{ 
          sandiklar.reduce((acc:any, sandik:any) => acc + Number(sandik.digerOySayisi), 0)
          }</b></h2>
             <div>Anlık sayfa güncellenmesi {minute} saniye sonra yapılacak yada  <button style={{border:"1px solid #000",padding:5,borderRadius:8}} onClick={()=>{
              setRender(Math.random().toString())
              setMinute(180);
              }}> Yenile </button> tuşuyla yenileyin. </div>
        
        <br></br>
          <div style={{color:"red",fontWeight:"bold"}}>!!!Sandık görevlileri harici lütfen oy sayısını değiştirmeyiniz.</div>
        <br></br>
        <br></br>
     
         <Bolge onSetBolgeler={onSetBolgeler} />

        <div className="table-container">
              
              {
                bolgeler.map((bolge:any) => (
                  <div key={bolge.id}>
                    <h2 style={{textAlign:"center",fontSize:20}}><b>{bolge.bolgeAdi} - {bolge.sorumlu}</b></h2
                    >
                    <br></br>
                    <br></br>
                    <Tablolar 
                    baseSandiklar={sandiklar.filter((sandik:any) => sandik.bolgeNo == bolge.id)}
                    bolge={bolge}
                    setRender={setRender}
                    />
                  </div>
                ))
                  
              }
      </div>

      <br></br>
      <br></br>
      Silme ve Güncelle için 05423725116 (Ekrem Tınas) numaralı telefondan ulaşabilirsiniz.
    </main>
  );
}




const Tablolar = ({ 
  baseSandiklar,
  bolge,
  setRender
}:{ 
  baseSandiklar:any,
    bolge:any,
    setRender:any

  }) => {
 

    
 //!Yeni Firebase Config
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
  const CollectionRef = collection(db, "sarayonusecim")



  const [sorumlu, setSorumlu] = useState("");
  const [sandikNo, setSandikNo] = useState("");
  const [refahOySayisi, setRefahOySayisi] = useState(0);
  const [akpOySayisi, setAkpOySayisi] = useState(0);
  const [bagimsizOySayisi, setBagimsizOySayisi] = useState(0);
  const [digerOySayisi, setDigerOySayisi] = useState(0);
  const [sandiklar, setSandiklar] = useState<any>(baseSandiklar);

const refahUpdate =async(id:any,oySayisi:any)=>{
  const sandikDoc = doc(db, "sarayonusecim", id);
  console.log(sandikDoc)
  const newReg = { refahOySayisi: oySayisi }
  console.log("Updated the Data on System")
  await updateDoc(sandikDoc, newReg)
  console.log("Updated the Data on the Server")
  setRender(Math.random().toString());
}

  const refahOySayisiGuncelle = (id:any, oySayisi:any) => {
    setSandiklar(sandiklar.map((sandik:any) => {
      if (sandik.id === id) {
        refahUpdate(id,oySayisi);
        sandik.refahOySayisi = oySayisi;

        return { ...sandik, oySayisi };


        
      } else {
        return sandik;
      }
    }));
  };
const akpUpdate =async(id:any,oySayisi:any)=>{
  const sandikDoc = doc(db, "sarayonusecim", id);
  console.log(sandikDoc)
  const newReg = { akpOySayisi: oySayisi }
  console.log("Updated the Data on System")
  await updateDoc(sandikDoc, newReg)
  console.log("Updated the Data on the Server")
  setRender(Math.random().toString());
}

  const akpOySayisiGuncelle = (id:any, oySayisi:any) => {
    setSandiklar(sandiklar.map((sandik:any) => {
      if (sandik.id === id) {
        akpUpdate(id,oySayisi);
        sandik.akpOySayisi = oySayisi;

        return { ...sandik, oySayisi };


        
      } else {
        return sandik;
      }
    }));
  };
const bagimsizUpdate =async(id:any,oySayisi:any)=>{
  const sandikDoc = doc(db, "sarayonusecim", id);
  console.log(sandikDoc)
  const newReg = { bagimsizOySayisi: oySayisi }
  console.log("Updated the Data on System")
  await updateDoc(sandikDoc, newReg)
  console.log("Updated the Data on the Server")
  setRender(Math.random().toString());
}

  const bagimsizOySayisiGuncelle = (id:any, oySayisi:any) => {
    setSandiklar(sandiklar.map((sandik:any) => {
      if (sandik.id === id) {
        bagimsizUpdate(id,oySayisi);
        sandik.bagimsizOySayisi = oySayisi;

        return { ...sandik, oySayisi };


        
      } else {
        return sandik;
      }
    }));
  };
const digerUpdate =async(id:any,oySayisi:any)=>{
  const sandikDoc = doc(db, "sarayonusecim", id);
  console.log(sandikDoc)
  const newReg = { digerOySayisi: oySayisi }
  console.log("Updated the Data on System")
  await updateDoc(sandikDoc, newReg)
  console.log("Updated the Data on the Server")
  setRender(Math.random().toString());
}

  const digerOySayisiGuncelle = (id:any, oySayisi:any) => {
    setSandiklar(sandiklar.map((sandik:any) => {
      if (sandik.id === id) {
        digerUpdate(id,oySayisi);
        sandik.digerOySayisi = oySayisi;

        return { ...sandik, oySayisi };


        
      } else {
        return sandik;
      }
    }));
  };


  const sandikEkle = async (bolgeNo:any) => {
    const data = {
      bolgeNo,
      sorumlu,
      sandikNo,
      refahOySayisi,
      akpOySayisi,
      bagimsizOySayisi,
      digerOySayisi
    };
    const docRef = await addDoc(CollectionRef, data);
    console.log("Document written with ID: ", docRef.id);
    setSandiklar([...sandiklar, { ...data, id: docRef.id }]);
    setSorumlu("");
    setSandikNo("");
    setRefahOySayisi(0);
    setAkpOySayisi(0);
    setBagimsizOySayisi(0);
    setDigerOySayisi(0);
  };

  const sandikSil =async(id:any)=>{
    setSandiklar(sandiklar.filter((s:any) => s.id !==id));
    const sandikDoc = doc(db, "sarayonusecim", id);
    console.log(sandikDoc)
    await deleteDoc(sandikDoc)
    console.log("Updated the Data on the Server")
  }
  console.log(sandiklar)





  return (
    <div>
       <span style={{textAlign:"center",fontSize:20 ,marginLeft:10 , paddingRight:10, borderRight:"1px solid #000"}}><b>
          Refah Toplam:{ 
          sandiklar.reduce((acc:any, sandik:any) => acc + Number(sandik.refahOySayisi), 0)
          }</b></span>
        <span style={{textAlign:"center",fontSize:20  ,marginLeft:10, paddingRight:10, borderRight:"1px solid #000"}}><b>
          Akp Toplam:{ 
          sandiklar.reduce((acc:any, sandik:any) => acc + Number(sandik.akpOySayisi), 0)
          }</b></span>
        <span style={{textAlign:"center",fontSize:20  ,marginLeft:10, paddingRight:10, borderRight:"1px solid #000"}}><b>
          Bagimsiz Toplam:{ 
          sandiklar.reduce((acc:any, sandik:any) => acc + Number(sandik.bagimsizOySayisi), 0)
          }</b></span>
        <span style={{textAlign:"center",fontSize:20  ,marginLeft:10, paddingRight:10}}><b>
          Diğer Toplam:{ 
          sandiklar.reduce((acc:any, sandik:any) => acc + Number(sandik.digerOySayisi), 0)
          }</b></span>
      <table>
        <thead>
          <tr>
            <th>Sorumlu</th>
            <th>Sandık No</th>
            <th>Refah Oy Sayısı</th>
            <th>Akp Oy Sayısı</th>
            <th>Bağımsız Oy Sayısı</th>
            <th>Diğer Oy Sayısı</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {sandiklar.map((sandik:any) => (
            <tr key={sandik.id}>
              <td>{sandik.sorumlu}</td>
              <td>{sandik.sandikNo}</td>
              <td>
                <input
                  type="number"
                  value={sandik.refahOySayisi}
                  onChange={(e) => refahOySayisiGuncelle(sandik.id, e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={sandik.akpOySayisi}
                  onChange={(e) => akpOySayisiGuncelle(sandik.id, e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={sandik.bagimsizOySayisi}
                  onChange={(e) => bagimsizOySayisiGuncelle(sandik.id, e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={sandik.digerOySayisi}
                  onChange={(e) => digerOySayisiGuncelle(sandik.id, e.target.value)}
                />
              </td>
              <td>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => sandikSil(sandik.id)}>Sil</button>
              </td>
            </tr>
          ))}
           <tr hidden={false}>
            <td   >
              <input type="text" value={sorumlu} onChange={(e:any)=>setSorumlu(String(e.target.value))} placeholder="Sorumlu" />
              </td>
              <td>
              <input type="text" value={sandikNo} onChange={(e:any)=>setSandikNo(String(e.target.value))}   placeholder="Sandık No" />
              </td>
              <td>
              <input type="number"  value={refahOySayisi} onChange={(e:any)=>setRefahOySayisi(Number(e.target.value))} placeholder="Refah Oy Sayısı" />
              </td>
              <td>
              <input type="number"  value={akpOySayisi} onChange={(e:any)=>setAkpOySayisi(Number(e.target.value))} placeholder="Akp Oy Sayısı" />
              </td>
              <td>
              <input type="number"  value={bagimsizOySayisi} onChange={(e:any)=>setBagimsizOySayisi(Number(e.target.value))} placeholder="Bagimsiz Oy Sayısı" />
              </td>
              <td>
              <input type="number"  value={digerOySayisi} onChange={(e:any)=>setDigerOySayisi(Number(e.target.value))} placeholder="Diger Oy Sayısı" />
              </td>
              <td>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>sandikEkle(bolge.id)}>Ekle</button>
                </td>
             
          </tr>
        </tbody>
      </table>
    </div>
  );
}