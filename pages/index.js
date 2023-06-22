import Layout from '@/widget/Layout';
import Iconhapus from '@/asset/Iconhapus';
import Iconubah from '@/asset/Iconubah';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {db} from "@/config/firebase";
import {collection, getDocs, doc, deleteDoc} from "firebase/firestore";


export default function Home() {
  const [buku, setBuku] = useState([]); //state untuk tempat data setBuku untuk update isinya 
  const router = useRouter();
  const addBookHandler = () => {
    router.push("/tambah-buku");
  };
  const updateBookHandler = (id) => {
    router.push(`/ubah-buku/${id}`);
  };
  const bukuCollectionRef = collection(db,"buku");

  const getBukuList = async() => {
  try {
    const data = await getDocs(bukuCollectionRef)
    const filteredData = data.docs.map((doc) => ({...doc.data(), id: doc.id,}));
    setBuku(filteredData);
    console.log(data);
    console.log(filteredData);
    }catch(err) {
      console.log(err);
      }
  };

  useEffect(() => {  
    getBukuList();
  }, []);

  const deleteBuku = async(id) => {
    const bukuDoc = doc(db, "buku", id);
    await deleteDoc(bukuDoc);
    getBukuList();
  }
  
  return (
    <Layout>
      <div className="flex justify-center mx-3">
        <div>
          {/* judul */}
          <div className="mt-10 mb-10">
            <h3 className="text-3xl font-semibold">Data Buku Perpustakaan</h3>
            </div>
            <div>
              <button onClick={addBookHandler} className="bg-sky-500 text-white px-6 py-2 rounded-full hover:bg-sky-700">Tambah Buku</button>
            </div>
            <div>
              <table className="bg-sky-50 py-10 rounded-xl table-auto mt-5">
                <thead className="mx-3 border-b-4">
                  <tr>
                    <th className="px-6 py-3">Nama Buku</th>
                    <th className="px-6 py-3">Pengarang</th>
                    <th className="px-6 py-3">Deskripsi Buku</th>
                    <th className="px-6 py-3">Tahun Terbit</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody >
                  {buku.map((data) =>(
                  <tr className="hover:bg-sky-200" key={data.id}>
                    <td className="px-6 py-3">{data.nama_buku}</td>
                    <td className="px-6 py-3">{data.pengarang}</td>
                    <td className="px-6 py-3">{data.deskripsi_buku}</td>
                    <td className="px-6 py-3">{data.tahun_terbit}</td>
                    <td className=" flex px-6 py-3">
                      <span className="cursor-pointer h-8 w-8 mr-2 hover:text-sky-500"
                      onClick={()=>{updateBookHandler(data.id);}}><Iconubah/></span>
                      <span className="cursor-pointer h-8 w-8 mr-2 hover:text-red-500" onClick={() => {deleteBuku(data.id);}}
                      ><Iconhapus/></span>
                    </td>
                    </tr>
                    ))}
                  
                </tbody>
              </table>
            </div>
          
        </div>
      </div>
    </Layout>
  );
}