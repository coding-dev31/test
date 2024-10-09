import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import excelFile from './commandes.xlsx'; 
import upload_noest from './upload_noest.xlsx'; 
import SelectAutoWidth from './SelectForm';
import Button from '@mui/material/Button';
import annulerImg from './annuler.png';
import ajouterImg from './ajouter.png';
import listImg from './list.png';
import loadImg from './load.png';
import restartImg from './restart.png';
import SelectInput from './SelectInput';
import { saveAs } from 'file-saver';

function App() {

    const [Clients,setClients] = useState([]);
    const [wilaya, setWilaya] = useState([]); 
    const [communes, setCommunes] = useState([]);
    const [communeschanged, setCommuneschanged] = useState([]);
    const [wilayaSelected, setWilayaSelected] = useState("");
    const [communeSelected, setCommuneSelected] = useState("");
    const [TypeDenvoi, setTypeDenvoi] = useState("");
    const [TypeDePrestation, setTypeDePrestation] = useState("");
    const [nomClient,setnomClient]= useState("");
    const [teleph1,setteleph1]= useState("");
    const [teleph2,setteleph2]= useState("");
    const [adresse,setadresse]= useState("");
    const [poids,setpoids]= useState("");
    const [mantant,setmantant]= useState("");
    const [reference,setreference]= useState("");
    const [remarque,setremarque]= useState("");
    const [produit,setproduit]= useState("");

    const readExcelFile = async () => {
    try {
      const response = await fetch(excelFile);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });

        const sheetNameWilaya = workbook.SheetNames[0];
        const sheetwilaya = workbook.Sheets[sheetNameWilaya];

        const jsonDatawilaya = XLSX.utils.sheet_to_json(sheetwilaya, { header: 1 });
        let listwilaya = jsonDatawilaya.map((item) => {
          return { code: item[0], nom: item[1] };
        });
        setWilaya(listwilaya.slice(1)); 

        const sheetNamecommunes = workbook.SheetNames[1];
        const sheetcommunes = workbook.Sheets[sheetNamecommunes];

        const jsonDatacommunes = XLSX.utils.sheet_to_json(sheetcommunes, { header: 1 });
        let listcommunes = jsonDatacommunes.map((item) => {
          return { nom: item[0], code: item[1] };
        });

        setCommunes(listcommunes.slice(1)); 
        setCommuneschanged(listcommunes.slice(1));
      };

      reader.readAsBinaryString(blob);
    } catch (error) {
      console.error('Erreur lors de la lecture du fichier Excel :', error);
    }
  };

  useEffect(() => {
    readExcelFile();
  }, []);

  useEffect(() => {
    if (wilayaSelected && wilayaSelected.code) {
      let list = communes.filter(item => item.code === wilayaSelected.code);
      setCommuneschanged(list);
    } else {
      setCommuneschanged(communes);
    }
  }, [wilayaSelected, communes]);

  useEffect(()=>{
    console.log(Clients);
  },[Clients])

  const handelClear = ()=>{
    setproduit("");
    setremarque("");
    setnomClient("");
    setteleph1("");
    setteleph2("");
    setadresse("");
    setpoids("");
    setmantant("");
    setreference("");
    setWilayaSelected("");
    setCommuneSelected("");
    setTypeDenvoi("");
    setTypeDePrestation("");
  }

  const handelAdd = async () => {
    if(nomClient != "" && teleph1 != "" && wilayaSelected != "" 
      && communeSelected != "" && adresse != "" && poids !=""
      && TypeDenvoi !="" && TypeDePrestation !="" && mantant != ""
      && reference != "" && remarque!="" && produit!=""){
          let client = {
            "reference commande": reference,
            "nom et prenom du client \r\n(obligatoire)": nomClient,
            "telephone \r\n(obligatoire)": teleph1,
            "telephone 2": teleph2,
            "adresse de livraison\r\n (obligatoire)": adresse,
            "commune de livraison": communeSelected.nom,
            "montant du colis \r\n(obligatoire)": mantant,
            "code wilaya \r\n(obligatoire)": wilayaSelected.code,
            "produit": produit,
            "remarque": remarque,
            "poids\r\n( en kg )": poids,
            "PICK UP\r\n( si oui mettez OUI sinon laissez vide )": TypeDenvoi === "Pick Up" ? "OUI" : "",
            "ECHANGE\r\n( si oui mettez OUI sinon laissez vide )": TypeDenvoi === "Echange" ? "OUI" : "",
            "STOP DESK\r\n( si oui mettez OUI sinon laissez vide )": TypeDePrestation === "Stop desk" ? "OUI" : "",
            "Ouvrir le colis \r\n( si oui mettez OUI sinon laissez vide )": ""
        };
        await setClients([...Clients,client]);
        console.log(Clients)
        handelClear()
    }

    else alert("Inserer les informations de Client")
  }

  
  const handelLister = ()=>{
    
  }
  const handlrestart = ()=>{
    handelClear();
    setClients([]);
  }
  const handleSaveFile = () => {
    if(Clients.length >0){
      const worksheet = XLSX.utils.json_to_sheet(Clients);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, 'updated_file.xlsx');
    }else {
      
      alert('La liste des clients est vide. Impossible de sauvegarder.');
    }
  };
  



  

  return (
    <div className="App">
      <div className="ajout-container flex">
        <div className='ajout-container-title flex margin'>
          Ajouter un colis
        </div>
        <div className="ligne"></div>
        <div className='ajout-container-body flex'>

          <div className='box-infos flex '>
            <div className='infos-title flex margin'>
              Informations sur le client
            </div>
            <div className="ligne"></div>
            <div className='client-infos flex margin'>
            <input  className='input' 
                    placeholder='Nom de client' 
                    value={nomClient} 
                    onChange={(event) => setnomClient(event.target.value)} 
            />

              <input  className='input' 
                      placeholder='telephone 1' 
                      value={teleph1} 
                      onChange={(event) => setteleph1(event.target.value)} 
              />
              <input  className='input' 
                      placeholder='telephone 2' 
                      value={teleph2} 
                      onChange={(event) => setteleph2(event.target.value)} 
              />
            </div>
          </div>

          <div className='box-infos flex '>
            <div className='infos-title flex margin'>
              Informations sur l'adresse
            </div>
            <div className="ligne"></div>
            <div className='adresse-infos flex margin'>
              <SelectAutoWidth
                value={wilayaSelected}
                setValue={setWilayaSelected}
                list={wilaya}
                label="Wilaya"
              />
              <SelectAutoWidth
                value={communeSelected}
                setValue={setCommuneSelected}
                list={communeschanged}
                label="Commune"
              />
              <input  className='input' 
                      placeholder='Adresse' 
                      value={adresse} 
                      onChange={(event) => setadresse(event.target.value)} 
              />

            </div>
          </div>

          <div className='box-infos flex '>
            <div className='infos-title flex margin'>
              Type d'envoi
            </div>
            <div className="ligne"></div>
            <div className='adresse-infos flex margin'>
              <input  className='input' 
                      placeholder='Poids' 
                      value={poids} 
                      onChange={(event) => setpoids(event.target.value)} 
              />
              <SelectInput
                value={TypeDenvoi}
                setValue={setTypeDenvoi}
                list={["Livraison","Echange","Pick Up"]}
                label="Type d'envoi"
              />
              <SelectInput
                value={TypeDePrestation}
                setValue={setTypeDePrestation}
                list={["Stop desk","A domicile"]}
                label="Type de prestation"
              />
            </div>
          </div>

          <div className='box-infos flex '>
            <div className='infos-title flex margin'>
              Mantant & Frais
            </div>
            <div className="ligne"></div>
            <div className='adresse-infos flex margin'>
              <input  className='input' 
                      placeholder='Mantant Total'
                      value={mantant} 
                      onChange={(event) => setmantant(event.target.value)} 
              />
              
            </div>
          </div>

          <div className='box-infos flex '>
            <div className='infos-title flex margin'>
              Informations supplémentaires
            </div>
            <div className="ligne"></div>
            <div className='adresse-infos flex margin'>
              <input  className='input' 
                      placeholder='Reference' 
                      value={reference} 
                      onChange={(event) => setreference(event.target.value)} 
              />
              <input  className='input' 
                      placeholder='Remarque' 
                      value={remarque} 
                      onChange={(event) => setremarque(event.target.value)} 
              />
              <input  className='input' 
                      placeholder='Produit' 
                      value={produit} 
                      onChange={(event) => setproduit(event.target.value)} 
              />
            </div>
          </div>

          <div className='button-box flex '>
          <img  src={annulerImg} 
                  onClick={handelClear}
                  className='annuler'
            />
            <img  src={ajouterImg}
                  onClick={handelAdd}
                  className='ajouter'
            />
            <img  src={listImg}
                  onClick={handelLister}
                  className='list'
            />
            <img  src={loadImg}
                  onClick={handleSaveFile}
                  className='load'
            />
            <img  src={restartImg}
                  onClick={handlrestart}
                  className='restart'
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
