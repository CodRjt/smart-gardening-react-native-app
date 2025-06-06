import { client, COLLECTION_ID, DATABASE_ID, databases, WATERING_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context"; // Adjust the import path as necessary
import { plant ,zone} from "@/types/types";
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Importing MaterialCommunityIcons
import { useEffect, useRef, useState } from "react";
import { TouchableOpacity, ScrollView, StyleSheet, View, Image } from "react-native";
import { ID, Query } from "react-native-appwrite";
import { Swipeable } from "react-native-gesture-handler";
import { Button, Surface, Text, useTheme } from "react-native-paper";
import AntDesign from '@expo/vector-icons/AntDesign';

// Assuming you have a useAuth hook to handle authentication
const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  cardCompleted: {
    marginTop: 14,
    marginBottom: 5,
    borderRadius: 13,
    backgroundColor: "#f2f6fa",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 13,
    elevation: 8,
    borderColor:"#87ceeb",
    borderWidth:2,


  },
  card: {
    marginTop: 14,
    marginBottom: 5,
    borderRadius: 13,
    backgroundColor: "#f2f6fa",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 13,
    elevation: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    margin: 24,
    minHeight: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyStateText: {
    fontWeight: "bold",
    color: "#90a4ae",
    fontSize: 20,
    textAlign: "center",
    marginTop: 8,
    letterSpacing: 0.5,
  },
  cardContent: {
    padding: 18,
    
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    color: "brown",
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 15,
  },
  cardSubtitle: {
    color: "#4e8d7c",
    fontSize: 16,
    marginBottom: 8,
  },
  cardDesc: {
    color: "#6c6c80",
    fontSize: 16,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardLabel: {
    color: "red",
    fontWeight: "bold",
  },
  cardValue: {
    color: "black",
  },
  buttonArray: {
    flexDirection: "row",
    gap:8,
    // justifyContent:""
  },
  leftAction: {
    flex: 1,
    backgroundColor: "red",
    justifyContent: "center",
    padding: 15,
    borderRadius: 15,
    marginTop: 22,
    marginBottom: 22
  },
  rightAction: {
    flex: 1,
    backgroundColor: "green",
    justifyContent: "center",
    padding: 15,
    borderRadius: 15,
    marginTop: 22,
    alignItems: "flex-end",
    marginBottom: 22
  },
  cardHeader: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  }

});
export default function Index() {
  const { user, signout } = useAuth();
  const [plant, setPlant] = useState<plant[]>()
  const [wateredZone,setWateredZone]=useState<number[]>()

  const theme = useTheme();
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [selectedZone, setSelectedZone] = useState<number>(0)
  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({})
  const fetchPlant = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      )
      setPlant(response.documents as plant[])

    } catch (error) {
      console.error(error)
    }
  }
   const fetchPlantToday = async () => {
    const today=new Date();
    today.setHours(0,0,0,0);
    const todayISO = today.toISOString();
    try {
      const respons = await databases.listDocuments(
        DATABASE_ID,
        WATERING_ID,
        [Query.equal("user_id", user?.$id ?? ""),
        Query.greaterThan("last_watered",todayISO)
        ]
      )
      const watered=respons.documents as zone[]
      setWateredZone(watered.map((zone)=>(zone.zone_id)))

    } catch (error) {
      console.error(error)
    }
  }
  useEffect(()=>{
    if(
      selectedZone!==0 && 
      (!plant?.some((p)=>p.Plant_zone===selectedZone))
    ){
      setSelectedZone(0);
    }
  },[plant,selectedZone])
  useEffect(() => {
    if (user) {
      const channel = `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`;
      const plantSubscription = client.subscribe(channel,
        (response) => {
          if (response.events.includes('databases.*.collections.*.documents.*.create')) {
            fetchPlant()
          }
          else if (response.events.includes('databases.*.collections.*.documents.*.update')) {
            fetchPlant()
          }
          else if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
            fetchPlant()
          }

        }
      );
      const wateredChannel=`databases.${DATABASE_ID}.collections.${WATERING_ID}.documents`
      const wateredSubscription=client.subscribe(wateredChannel,
        (wateredResponse)=>{
          if(wateredResponse.events.includes('databases.*.collections.*.documents.*.create')){
            fetchPlantToday()
          }
        }
      )
      fetchPlant()
      fetchPlantToday()
      return () => {
        plantSubscription();
        wateredSubscription();
      }
    }
  }, [user])
  const filteredPlant =
    selectedZone === 0
      ? plant
      : plant?.filter((p) => p.Plant_zone === selectedZone);


  const zoneList = plant ? Array.from(new Set(plant.map((p) => p.Plant_zone))).sort((a, b) => (a - b)) : []
  const handleLeftAction = async (id: string) => {
    try{
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id)
    }catch(error){
      console.log(error)
    }
  }
  const handleRightAction=async(id:string)=>{
    const plant=filteredPlant?.find((p)=>p.$id===id)
    waterZone(Number(plant?.Plant_zone))
    const plantsInZone=filteredPlant?.filter((p)=>p.Plant_zone===plant?.Plant_zone)||[];
    const now=new Date().toISOString()
    try{
      if (!user || (wateredZone?.includes(Number(plant?.Plant_zone)))) return;
      console.log(wateredZone)
    await databases.createDocument(DATABASE_ID,WATERING_ID,ID.unique(),{
        user_id:user.$id,
        zone_id:plant?.Plant_zone,
        last_watered:now
      }
    );
    await Promise.all(
      plantsInZone?.map((plant)=>
        databases.updateDocument(
          DATABASE_ID,
          COLLECTION_ID,

          plant?.$id,
          {
            Plant_name:plant.Plant_name,
            last_watered:now,
            
          }
  )
))
    
  }catch(error){
      console.log(error)
    }

  }
  const rightAction = (zone:number) => ( 
  <View style={styles.rightAction}> 
  {isZoneWatered(zone)?
    (<Text style={{fontWeight:"bold",fontSize:16}}> Watered! {'\n'} Today</Text>):(
      <MaterialCommunityIcons name="check-circle-outline" size={32} color="#fff" />
    )}
     </View>
  )
  const leftAction = () => (
    <View style={styles.leftAction}>
      <MaterialCommunityIcons name="trash-can-outline" size={32} color="#fff" />
    </View>
  )
  const isZoneWatered=(zone:number)=>{
    return wateredZone?.includes(Number(zone))
  }
  const waterZone=(zone:number):void=>{
    return
  }
  return (

    <View style={styles.container} >
      <View style={styles.header}>
        <Text variant="headlineSmall" style={{
          color: theme.colors.inversePrimary,
          fontWeight: "bold",
        }}>
          My Plants
        </Text>
        <Button mode="contained" onPress={signout} icon={"logout"} style={{ marginTop: 20 }}>
          Sign Out
        </Button>
      </View>
      <View style={styles.buttonArray}>
        <Button
          mode={selectedZone === 0 ? "contained" : "outlined"}
          onPress={() => setSelectedZone(0)}
        >
          All
        </Button>
      
        {zoneList.map((zone, key) => (
          <Button
            mode={zone === selectedZone ? "contained" : "outlined"}
            onPress={() => setSelectedZone(zone)}
            key={key}
          >
            {zone}
          </Button>
        ))
        }

      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredPlant?.length === 0 ?
          (<View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No plants yet{"\n"} Add your first plant now </Text>
          </View>) : (
            filteredPlant?.map((p, key) => {
              const minSerial=Math.min(...filteredPlant.map((p)=>(p.plant_sno)))
              return (

                <Swipeable ref={(ref) => {
                  swipeableRefs.current[p.$id] = ref

                }}
                  key={key}
                  overshootLeft={false}
                  overshootRight={false}
                  renderLeftActions={leftAction}
                  renderRightActions={()=>(rightAction(p.Plant_zone))}
                  onSwipeableOpen={(direction) => {
                    if (direction === "left") {
                      handleLeftAction(p.$id)
                    }
                    else if (direction==="right"){
                      handleRightAction(p.$id)
                    }
                    swipeableRefs.current[p.$id]?.close();
                  }}
                >
                  <Surface style={[styles.card,isZoneWatered(p.Plant_zone) && styles.cardCompleted]}elevation={3}>
                    <View style={styles.cardContent}>
                      <View style={styles.cardHeader}>
                        <View>
                          
                          <Text style={styles.cardTitle}>
                            {p.Plant_name}
                            {p.plant_sno===minSerial &&<AntDesign name="star" size={24} color="orange" />}
                          </Text>
                         
                          <Text style={styles.cardSubtitle}>
                            Species: <Text style={{ color: "#4e8d7c" }}>{p.species}</Text>
                          </Text>
                        </View>
                        <Image source={{ uri: p.url }}
                          style={{ width: 80, height: 80, backgroundColor: "#eee" }}
                        />
                      </View>

                      <Text style={styles.cardDesc}>
                        {p.plant_desc}
                      </Text>
                      <TouchableOpacity
                          onPress={()=> 
                            setExpandedCard(expandedCard===p.$id?null:p.$id)}
                            style={{paddingVertical:8}}
                          >
                            <Text style={{color:"4e8d7c",fontWeight:"bold"}}>
                              {expandedCard=== p.$id? "Hide Details ":"Show Details"}
                            </Text>
                          </TouchableOpacity>
                     {expandedCard===p.$id && (<><View style={styles.cardRow}>
                        <Text style={styles.cardLabel}>Zone:</Text>
                        <Text style={styles.cardValue}>{p.Plant_zone}</Text>
                      </View>
                      <View  style={styles.cardRow}>
                        <Text style={styles.cardLabel}>Serial no:</Text>
                        <Text style={styles.cardValue}> {p.plant_sno}</Text>
                      </View>
                      <View style={styles.cardRow}>
                        <Text style={styles.cardLabel}>Last Watered:</Text>
                        <Text style={styles.cardValue}>
                          {new Date(p.last_watered).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </View>
                      <View style={styles.cardRow}>
                        <Text style={styles.cardLabel}>Day of Entry:</Text>
                        <Text style={styles.cardValue}>
                          {new Date(p.Day_of_entry).toLocaleDateString()}
                        </Text>
                      </View></>)}
                    </View>
                  </Surface>
                </Swipeable>
              )
            })
          )
        }
      </ScrollView>
    </View>

  );

}
