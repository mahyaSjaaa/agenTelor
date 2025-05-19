'use client'

import * as React from 'react';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { useState, useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import { poppins_tebal } from '@/component/font';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { poppins_normal } from '@/component/font';
import { supabase } from '@/dbInitial/supabase';

type Kuitansi = {
  id: number
  jumlah: number
  harga: number
  tanggal: string
  created_at: string,
  jenis: string
}


export default function PemasukanPage() {
    const [berat, setBerat] = useState(0)
    const [age, setAge] = React.useState('');
    const [harga, setHarga] = useState(0)
    const [totalHarga, setTotalHarga] = useState(0)
    const [datas, setDatas] = useState<any>([])
    const [isLoading, setIsLoading] = useState(true)

    const jakartaTime = new Date().toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"})
    const sekarang = new Date(jakartaTime)
    sekarang.setHours(0,0,0,0)

    const lastMonth = new Date(jakartaTime)
    lastMonth.setMonth(lastMonth.getMonth() -1)

    const lastThreeMonth = new Date(jakartaTime)
    lastThreeMonth.setDate(lastThreeMonth.getDate() -3)
    
    useEffect(() => {
        setTotalHarga(berat * harga)
    }, [berat, harga])

    const inputData = async(jumlah:number, total:number, tgl:string) => {
        const date = new Date()
        const formatted = date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        });

        console.log(tgl);
        
        
        const { error } = await supabase.from('kuitansi').insert({created_at: tgl,harga: total, jumlah: jumlah, tanggal: formatted, jenis:"pemasukan" })
        if(error){
            console.log(error);
            
        }else{
            alert("data berhasil ditambahkan!")
        }
    }

    const handleDelete = async (id:number) => {
        console.log(id);
        const response = await supabase.from('kuitansi').delete().eq('id', id)
        console.log(response);
        alert("berhasil dihapus")
    }

    useEffect(() => {
        const reqData = async () => {
            const { data, error } = await supabase.from('kuitansi').select('*').order('id', {ascending: false}).eq('jenis', "pemasukan")
            setDatas(data)
            setIsLoading(false) 
            if(error){
                console.log(error);
            }
        }
        reqData()
    },[inputData, handleDelete])

    const handleBerat = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBerat(parseFloat(event.target.value))
    }

    const handleHarga = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHarga(parseFloat(event.target.value))
    }

    const handleChange = async (event: SelectChangeEvent) => {
        setAge(event.target.value);
        return age
    };

    useEffect(() => {
        const fetch = async () => {
            if(age === "Hari ini"){
                console.log(age);

                const {data, error} = await supabase.from('kuitansi').select().order('id', {ascending: false}).eq('created_at', sekarang.toLocaleDateString()).eq('jenis', "pemasukan")
                setDatas(data)
                if(error){
                    console.log(error);
                }
            }else if(age === "Bulan ini"){
                console.log(age);
                
                const {data, error} = await supabase.from('kuitansi').select().order('id', {ascending:false}).gte('created_at', lastMonth.toLocaleDateString()).lte('created_at', sekarang.toLocaleDateString()).eq('jenis', "pemasukan")
                setDatas(data)
                if(error){
                    console.log(error);
                }
            }else if(age === "3 bulan"){
                console.log(age);
                
                const {data, error} = await supabase.from('kuitansi').select().order('id', {ascending: false}).gte('created_at', lastThreeMonth.toLocaleDateString()).lte('created_at', sekarang.toLocaleDateString()).eq('jenis', "pemasukan")
                setDatas(data)
                if(error){
                    console.log(error);
                }
            }else if(age === "Semua"){
                const {data, error} = await supabase.from('kuitansi').select().order('id', {ascending:false}).eq('jenis', "pemasukan")
                setDatas(data)
                if(error){
                    console.log(error);
                }
            }
        }
        fetch()
    },[age])

    return (
        <div className="pt-25 pl-20 h-screen">
            <main className="block">
                <h1 className={`${poppins_tebal.className} text-[20px] lg:text-[24px] px-5 lg:px-20 pt-6`}>Catat penjualan</h1>
                <div className='lg:flex lg:justify-between justify-between lg:items-center items-center px-5 pb-10 lg:px-20'>
                    <FormControl variant="standard" sx={{ m: 1, mt: 3, width: '25ch' }} >
                        <Input className='pt-5.5'
                            id="standard-adornment-weight"
                            endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                            aria-describedby="standard-weight-helper-text"
                            inputProps={{
                            'aria-label': 'weight',
                            }}
                            onChange={handleBerat}
                        />
                        <FormHelperText id="standard-weight-helper-text">Weight</FormHelperText>
                    </FormControl>
                    <div className='w-55 lg:w-60'>
                        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                            <InputLabel htmlFor="standard-adornment-amount">Harga per -kg</InputLabel>
                            <Input
                                id="standard-adornment-amount"
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                onChange={handleHarga}
                            />
                        </FormControl>
                    </div>
                    <p className='pl-19 mt-2 px-1.5'>Total harga: {totalHarga}</p>
                    <button  onClick={() =>inputData(berat, totalHarga, sekarang.toLocaleDateString())} className='mt-2 px-1.5 bg-black px-6 mr-5 text-white py-1.5 rounded-full text-[12px] ml-20'>Simpan</button>
                </div>

                {/* riwayat */}
                        <div className="flex justify-between items-center lg:px-20  pb-5">
                          <div>
                            <h1 className={`${poppins_tebal.className} text-[16px] lg:text-[24px] px-5 lg:px-20 pt-6`}>Riwayat Penjualan Per {age}</h1>
                          </div>
                          <div className="pb-4 mr-5">
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
                                {isLoading ? <p>loading..</p> : (
                                    datas&&datas.map((data: Kuitansi) => (
                                        <div key={data.id} className="lg:ml-20 lg:mr-25 lg:px-20 px-3 mr-6 flex justify-between items-center border-2 border-black rounded-xl py-1.5 bg-green-200 mb-2">
                                            <p className={`${poppins_normal.className} text-[12px] lg:text-[16px]`}>{data.id}</p>
                                            <p className={`${poppins_normal.className} text-[12px] lg:text-[16px]`}>{data.jumlah} Kg</p>
                                            <p className={`${poppins_normal.className} text-[12px] lg:text-[16px]`}>Rp. {data.harga}</p>
                                            <p className={`${poppins_normal.className} text-[12px] lg:text-[16px]`}>{data.tanggal}</p>
                                        <button onClick={() => handleDelete(data.id)} className={`${poppins_normal.className} text-[12px] lg:text-[16px]`}>delete</button>
                                </div>
                                    ))
                                )}
            </main>
        </div>
    )
}