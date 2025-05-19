'use client'

import { poppins_normal, poppins_tebal } from "@/component/font";

import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { supabase } from "@/dbInitial/supabase";

type Kuitansi = {
  id: number
  jumlah: number
  harga: number
  tanggal: string
  created_at: string,
  jenis: string
}


export default function Home() {
  const[age, setAge] = React.useState('');
  const[datas, setDatas] = React.useState<any>([])
  const[pemasukan, setPmeasukan] = React.useState<any>(0)
  const[pengeluaran, setPengeluaran] = React.useState<any>(0)
  const[isLoading, setIsLoading] = React.useState(true)

  const jakartaTime = new Date().toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"})
  const sekarang = new Date(jakartaTime)
  sekarang.setHours(0,0,0,0)

  const lastMonth = new Date(jakartaTime)
  lastMonth.setMonth(lastMonth.getMonth() -1)

  const lastThreeMonth = new Date(jakartaTime)
  lastThreeMonth.setDate(lastThreeMonth.getDate() -3)


  React.useEffect(() => {
    const fetch = async()=> {
      const {data, error} = await supabase.from('kuitansi').select().order('id', {ascending:false})
      setDatas(data)
      setIsLoading(false)
      if(error){
        console.log(error);
      }
    }
    const fetchPemasukan = async()=> {
      const {data, error} = await supabase.from('kuitansi').select('harga').order('id', {ascending:false}).eq('jenis', "pemasukan")
      const total = data?.reduce((sum, item) => sum + (item.harga || 0), 0);
      console.log('Total harga:', total);
      setPmeasukan(total)
      setIsLoading(false)
      if(error){
        console.log(error);
      }}
      const fetchPengeluaran = async()=> {
        const {data, error} = await supabase.from('kuitansi').select('harga').order('id', {ascending:false}).eq('jenis', "pengeluaran")
        const total = data?.reduce((sum, item) => sum + (item.harga || 0), 0);
        console.log('Total harga:', total);
        setPengeluaran(total)
        setIsLoading(false)
        if(error){
          console.log(error);
      }}
    fetch()
    fetchPemasukan()
    fetchPengeluaran()
  }, [])

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
    return age
  };

    React.useEffect(() => {
          const fetch = async () => {
              if(age === "Hari ini"){
                  console.log(age);
  
                  const {data, error} = await supabase.from('kuitansi').select().order('id', {ascending: false}).eq('created_at', sekarang.toLocaleDateString())
                  setDatas(data)
                  if(error){
                      console.log(error);
                  }
              }else if(age === "Bulan ini"){
                  console.log(age);
                  
                  const {data, error} = await supabase.from('kuitansi').select().order('id', {ascending:false}).gte('created_at', lastMonth.toLocaleDateString()).lte('created_at', sekarang.toLocaleDateString())
                  setDatas(data)
                  if(error){
                      console.log(error);
                  }
              }else if(age === "3 bulan"){
                  console.log(age);
                  
                  const {data, error} = await supabase.from('kuitansi').select().order('id', {ascending: false}).gte('created_at', lastThreeMonth.toLocaleDateString()).lte('created_at', sekarang.toLocaleDateString())
                  setDatas(data)
                  if(error){
                      console.log(error);
                  }
              }else if(age === "Semua"){
                  const {data, error} = await supabase.from('kuitansi').select().order('id', {ascending:false})
                  setDatas(data)
                  if(error){
                      console.log(error);
                  }
              }
          }
          fetch()
      },[age])


  
  return (
    <div  className="pt-25 pl-20 h-screen">
      <main className="block">
        <div className="flex justify-between items-center lg:px-20 pb-5">
          <div>
            <h1 className={`${poppins_tebal.className} lg:text-[24px] text-[20px]`}>Keuangan Per {age}</h1>
          </div>
          <div className=" pb-4 mr-5">
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Per</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={age}
                onChange={handleChange}
                label="Age"
              >
                <MenuItem value="Semua">
                  <em>Semua</em>
                </MenuItem>
                <MenuItem value={"Hari ini"}>Hari ini</MenuItem>
                <MenuItem value={"Bulan ini"}>Bulan ini</MenuItem>
                <MenuItem value={"3 bulan"}>3 Bulan</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="flex flex-wrap justify-between items-center lg:px-20 pb-15">
          <div className="border-2 border-solid inset-shadow-sm/50 w-70 h-20 lg:w-90 lg:h-45 rounded-xl bg-green-200 mb-2">
            <div className="lg:px-7 lg:py-10 px-3 py-4.5">
              <p className={`${poppins_normal.className} text-[12px] lg:text-[24px]`}>Pendapatan</p>
              <p className={`${poppins_tebal.className} lg:text-[32px]`}>Rp. {pemasukan}</p>
            </div>
          </div>
          <div className="border-2 border-solid inset-shadow-sm/50 w-70 h-20 lg:w-90 lg:h-45 rounded-xl bg-red-200 mb-2">
            <div className="lg:px-7 lg:py-10 px-3 py-4.5">
              <p className={`${poppins_normal.className} text-[12px] lg:text-[24px`}>Pengeluaran</p>
              <p className={`${poppins_tebal.className} lg:text-[32px]`}>Rp. {pengeluaran}</p>
            </div>
          </div>
          <div className="border-2 border-solid inset-shadow-sm/50 w-70 h-20 lg:w-90 lg:h-45 rounded-xl bg-green-200 ">
            <div className="lg:px-7 lg:py-10 px-3 py-4.5">
              <p className={`${poppins_normal.className} text-[12px] lg:text-[24px`}>Untung</p>
              <p className={`${poppins_tebal.className} lg:text-[32px]`}>Rp. {pemasukan - pengeluaran}</p>
            </div>
          </div>
        </div>

        {/* riwayat */}
        <div className="flex justify-between items-center lg:px-20  pb-5">
          <div>
            <h1 className={`${poppins_tebal.className} lg:text-[24px] text-[16px]`}>Riwayat Transaksi Per {age}</h1>
          </div>
        </div>
        {isLoading ? (
  <p>loading..</p>
) : (
  datas &&
    datas.map((data: Kuitansi) => {
      if (data.jenis === "pengeluaran") {
        return (
          <div
            key={data.id}
            className="lg:ml-20 lg:mr-25 lg:px-20 px-3 mr-6 flex justify-between items-center border-2 border-black rounded-xl py-1.5 bg-red-200 mb-2"
          >
            <p className={`${poppins_normal.className} text-[12px] lg:text-[16px]`}>{data.id}</p>
            <p className={`${poppins_normal.className} text-[12px] lg:text-[16px]`}>{data.jumlah} Kg</p>
            <p className={`${poppins_normal.className} text-[12px] lg:text-[16px]`}>Rp. {data.harga}</p>
            <p className={`${poppins_normal.className} text-[12px] lg:text-[16px]`}>{data.tanggal}</p>
          </div>
        );
      } else {
        return (
          <div
            key={data.id}
            className="lg:ml-20 lg:mr-25 lg:px-20 px-3 mr-6 flex justify-between items-center border-2 border-black rounded-xl py-1.5 bg-green-200 mb-2"
          >
            <p className={`${poppins_normal.className} text-[12px] lg:text-[16px]`}>{data.id}</p>
            <p className={`${poppins_normal.className} text-[12px] lg:text-[16px]`}>{data.jumlah} Kg</p>
            <p className={`${poppins_normal.className} text-[12px] lg:text-[16px]`}>Rp. {data.harga}</p>
            <p className={`${poppins_normal.className} text-[12px] lg:text-[16px]`}>{data.tanggal}</p>
          </div>
        );
      }
    })
)}
      </main>
    </div>
  );
}
