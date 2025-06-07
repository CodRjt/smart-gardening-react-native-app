import { COLLECTION_ID, DATABASE_ID, databases, WATERING_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { TouchableOpacity,StyleSheet, View,Image } from "react-native";
import { ID, Query } from "react-native-appwrite";
import * as ImagePicker from 'expo-image-picker'
import { TextInput, Text, Button, useTheme } from "react-native-paper"; // Import TextInput from react-native-paper
import { AntDesign } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
export default function Add() {
  const router = useRouter()
  const { user } = useAuth()
  const [name, setName] = useState<string>("")
  const [species, setSpecies] = useState<string>("")
  const [description, setDesc] = useState<string>("")
  const [zone, setZone] = useState<number>(0)
  const [serial, setSerial] = useState<number>(0)
  const [interval, setInterval] = useState<number>(1)
  const [url, setUrl] = useState<string>("")
  const [serialError, setSerialError] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [nameError, setNameError] = useState<string>("")
  const [speciesError, setSpeciesError] = useState<string>("")
  const theme = useTheme()
  const [imageUri,setImageUri]=useState<string|null>(null)
  const handleSubmit = async () => {
    if (!user) return;

    try {
     const now =new Date().toISOString()
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          user_id: user.$id,
          Plant_name: name,
          species: species,
          plant_desc: description,
          Plant_zone: zone,
          plant_sno: serial,
          watering_duration_in_min: interval,
          url: imageUri? imageUri:url,
          Day_of_entry: new Date().toISOString(),
          last_watered: now
        }
      )
      await databases.createDocument(
        DATABASE_ID,
        WATERING_ID,
        ID.unique(),
        {
        user_id:user.$id,
        zone_id:zone,
        last_watered:now

        }
      )
      setDesc("")
      setName("")
      setUrl("")
      setZone(0)
      setSerialError("")
      setSerial(0)
      setImageUri(null)
      setSpecies("")
      setError("")
      console.log(imageUri)
      router.back()
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Unknown error encountered")
      }
    }

  }
  const pickImage=async()=>{
      const result=await ImagePicker.launchImageLibraryAsync({
        mediaTypes:ImagePicker.MediaTypeOptions.Images,
        allowsEditing:true,
        quality:1,
      });
      if (!result.canceled && result.assets && result.assets.length>0){
        setImageUri(result.assets[0].uri);
      }
    }
  const isSerialUnique = async (num: number) => {
    if (!user) return;
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID,
      [Query.equal("user_id", user?.$id),
      Query.equal("Plant_zone", zone),
      Query.equal("plant_sno", num)
      ])
    if (response.documents.length>0) {
      setSerialError("Plant with the same serial already exists in the same zone ")
    }
    else{
      setSerialError("");
    }
  }



  return (
    <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.container}>
      <TextInput
        label="Name"
        placeholder="Enter plant name"
        value={name}
        onChangeText={setName}
        style={{ marginBottom: 16 }}
        
      />
      {!name && <Text style={{ color: "red" }}>Name is a required field</Text>}
      <TextInput
        label="Species"
        placeholder="Enter the plant species"
        value={species}
        onChangeText={setSpecies}
        style={{ marginBottom: 16 }}
      />
      {!species && <Text style={{ color: "red" }}>Species is a required field</Text>}
      <TextInput
        label="Description"
        placeholder="Enter plant description"
        multiline
        value={description}
        onChangeText={setDesc}
        numberOfLines={4}
        style={{ marginBottom: 16 }}
      />
      <TextInput
        label="Zone"
        placeholder="Enter plant zone (1-10)"
        value={zone ? zone.toString() : ""}
        onChangeText={text => setZone(Number(text))}
        style={{ marginBottom: 16 }}
      />
      <TextInput
        label="Serial"
        placeholder="Enter Serial no of plant in the zone "
        value={serial ? serial.toString() : ""}
        onChangeText={async (text) => {
          await isSerialUnique(Number(text))
          setSerial(Number(text))
        }}
        style={{ marginBottom: 16 }}
      />
      {serialError && <Text style={{ color: "red" }}> {serialError}</Text>}
     {serial===1 && <><TextInput
        label="watering_interval"
        placeholder="Enter watering duration in minutes"
        style={{ marginBottom: 16 }}
        value={interval ? interval.toString() : ""}
        onChangeText={text => setInterval(Number(text))}
      />
      </>}
     {!imageUri  && <TextInput
        label="URL"
        placeholder="Enter plant image URL"
        value={url}
        onChangeText={setUrl}
        style={{ marginBottom: 16 }}

      />}
      <Button onPress={pickImage}>or Pick a local Image </Button>
      {imageUri &&(
        <View style={{alignItems:"center"}}>
        <Image
          source={{uri:imageUri}}
          style={{width:100,height:100,marginTop:10}}
          />
        <TouchableOpacity
          onPress={()=>setImageUri(null)}
          style={styles.button}
        >
          <AntDesign name="close" size={20} color="#fff"/>
        </TouchableOpacity>
        </View>
      )}
     {name && species && !serialError && <Button mode="contained" style={{marginTop:10}} onPress={handleSubmit} >
        Add Plant
      </Button>
}
      {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}
    </View>
</ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: "#f5f5f5"
  },
  button:{
    position:"absolute",
    top:2,
    right:2,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius:12,
    padding:2,
    zIndex:1,
  }
}
)