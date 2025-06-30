import { COLLECTION_ID, DATABASE_ID, databases, WATERING_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ID, Query } from "react-native-appwrite";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Surface, Text, TextInput, useTheme } from "react-native-paper"; // Import TextInput from react-native-paper
import { SafeAreaView } from "react-native-safe-area-context";
import {LinearGradient} from "expo-linear-gradient"
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
        setImageUri(result.assets[0].uri); //set the Image Uri only after checking its exsistence
        
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
    <SafeAreaView  style={{flex:1}}>
      <LinearGradient colors={["#e0f7fa", "#e8f5e9", "#fffde7"]}
     
      >
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>🌱 Add a New Plant</Text>
      <View style={{alignItems:'flex-end'}}>
        <Text style={{color:'pink',marginBottom:0}}> * represets a required field</Text>
      </View>
    <Surface style={styles.formCard}>
    <View style={styles.container}>
      <TextInput
        label="Nick Name *"
        placeholder="Enter plant name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        textColor="#222"
        placeholderTextColor="#888"
        
      />
      <TextInput
        label="Species *"
        placeholder="Enter the plant species"
        value={species}
        onChangeText={setSpecies}
        style={styles.input}
        textColor="#222"
        placeholderTextColor="#888"
      />
      <TextInput
        label="Description"
        placeholder="Enter plant description"
        multiline
        value={description}
        onChangeText={setDesc}
        numberOfLines={4}
        style={styles.input}
        textColor="#222"
        placeholderTextColor="#888"
      />
      <TextInput
        label="Zone *"
        placeholder="Enter plant zone (1-10)"
        value={zone ? zone.toString() : ""}
        onChangeText={text => setZone(Number(text))}
        style={styles.input}
        textColor="#222"
        placeholderTextColor="#888"
      />
      <TextInput
        label="Serial *"
        placeholder="Enter Serial no of plant in the zone "
        value={serial ? serial.toString() : ""}
        onChangeText={async (text) => {
          await isSerialUnique(Number(text))
          setSerial(Number(text))
        }}
        style={styles.input}
        textColor="#222"
        placeholderTextColor="#888"
      />
      {serialError && <Text style={{ color: "red" }}> {serialError}</Text>}
     {serial===1 && <><TextInput // Watering_interval can only be set for Representative plant ie plant with serial 1
        label="watering_interval"
        placeholder="Enter watering duration in minutes"
        style={styles.input}
        textColor="#222"
        placeholderTextColor="#888"
        value={interval ? interval.toString() : ""}
        onChangeText={text => setInterval(Number(text))}
      />
      </>}
     {!imageUri  && <TextInput  // hide the URL Input tag if Image a local image is selected
        label="URL"
        placeholder="Enter plant image URL" 
        value={url}
        onChangeText={setUrl}
        style={styles.input}
        textColor="#222"
        placeholderTextColor="#888"
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
     {name && species && zone && serial &&!serialError && <Button   //show the add button only after the required fields are filled  
             mode="contained" style={{marginTop:10}} onPress={handleSubmit} > 
        Add Plant                              
      </Button>
      }
      {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}
    </View>
    </Surface>
</ScrollView>
</LinearGradient>
</SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
 
  },
  input: {
  marginBottom: 18,
  backgroundColor: "#fff",
  borderRadius: 8,
  color: "#222",
},
  button:{
    position:"absolute",
    top:2,
    right:2,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius:12,
    padding:2,
    zIndex:1,
  },
  formCard: {
    margin: 16,
    marginTop:1,
    padding: 16,
    borderRadius: 16,
    elevation: 4,
    backgroundColor:"#e8f5e9",
    borderWidth:1,
    borderColor:"#c8e6c9",
  },
  title:{
    fontSize:24,
    color:"#388e3c",
    textAlign:"center",
    marginBottom:8,
    fontWeight:"bold",
    borderBottomWidth:2,
    borderBottomColor: "#a5d6a7",
    letterSpacing:1,
    textShadowColor:"rgba(60,120,60,0.15)",
    textShadowRadius:4,
    backgroundColor:"#e8f5e9",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
  }

}
)