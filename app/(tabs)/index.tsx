import {
  client,
  COLLECTION_ID,
  DATABASE_ID,
  databases,
  WATERING_ID,
  REPORT_ID
} from "@/lib/appwrite";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import { useAuth } from "@/lib/auth-context"; 
import { plant, zone,report } from "@/types/types";
import { MaterialCommunityIcons } from "@expo/vector-icons"; 
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import { act, useEffect, useRef, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Query } from "react-native-appwrite";
import { Swipeable } from "react-native-gesture-handler";
import { Button, Surface, Text, useTheme } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

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
    borderColor: "#87ceeb",
    borderWidth: 2,
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
  ReportCardLabel: {
    color: "black",
    fontWeight: "bold",
  },
  cardValue: {
    color: "black",
  },
  buttonArray: {
    flexDirection: "row",
    gap: 8,
    // justifyContent:""
  },
  leftAction: {
    flex: 1,
    backgroundColor: "red",
    justifyContent: "center",
    padding: 15,
    borderRadius: 15,
    marginTop: 22,
    marginBottom: 22,
  },
  rightAction: {
    flex: 1,
    backgroundColor: "green",
    justifyContent: "center",
    padding: 15,
    borderRadius: 15,
    marginTop: 22,
    alignItems: "flex-end",
    marginBottom: 22,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footer:{

  }
});
export default function Index() {
  const { user, signout } = useAuth();
  const [plant, setPlant] = useState<plant[]>();
  const [report,setReport]=useState<report| null>(null);
  const [wateredZone, setWateredZone] = useState<number[]>();
  const [system, setSystem] = useState<boolean>(false);
  const theme = useTheme();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<number>(0);
  const [showReport,setShowReport]=useState<boolean>(false)
  const [reportIndicator,setReportIndicator]=useState<boolean>(true)
  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});
  const { ip: Ip } = useLocalSearchParams<{ ip: string }>();
  // const [Ip,setIp]=useState<string>('none')
  // useEffect(()=>{
  //   fetch('https://api64.ipify.org?format=json')
  //   .then(response=>response.json())
  //   .then(data=>setIp(data.ip))
  //   .catch(err =>console.log(err))
  // },[]);
  const fetchPlant = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      );
      setPlant(response.documents as plant[]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPlantToday = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();
    try {
      const respons = await databases.listDocuments(
        DATABASE_ID,
        WATERING_ID,
        [
          Query.equal("user_id", user?.$id ?? ""),
          Query.greaterThan("last_watered", todayISO),
        ]
      );
      const watered = respons.documents as zone[];
      setWateredZone(watered.map((zone) => zone.zone_id));
    } catch (error) {
      console.error(error);
    }
  };
  const fetchReport=async ()=>{
    try{
      const response = await databases.listDocuments(
        DATABASE_ID,
        REPORT_ID,
        [
          Query.equal("user_id",user?.$id??""),
          Query.equal("zone_id",selectedZone),
          Query.orderDesc("report_time"),
          Query.limit(1)
        ]
      )
      const reportList=response.documents as report[];
      if (reportList.length>0){
        setReport(reportList[0])
      }
      else{
        setReport(null)
      }
      
      
      
    }catch (error){
      console.error(error)
    }
  }

  useEffect(() => {
    if (
      selectedZone !== 0 &&
      !plant?.some((p) => p.Plant_zone === selectedZone)
    ) {
      setSelectedZone(0);
    }
  }, [plant, selectedZone]);
 
  useEffect(()=>{
    if (user && selectedZone!==0){
      fetchReport()
    }
    setReportIndicator(true)
  },[selectedZone,user])
  useFocusEffect(
  useCallback(() => {
    fetchPlant();
    fetchPlantToday();

    return () => {
    };
  }, [user, Ip])  // re-subscribe if user or Ip changes
);

  useEffect(() => {
    if (user) {
      const channel = `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`;
      const plantSubscription = client.subscribe(
        channel,
        (response) => {
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            )
          ) {
            fetchPlant();
          } else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.update"
            )
          ) {
            fetchPlant();
          } else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.delete"
            )
          ) {
            fetchPlant();
          }
        }
      );

      const wateredChannel = `databases.${DATABASE_ID}.collections.${WATERING_ID}.documents`;

      const wateredSubscription = client.subscribe(
        wateredChannel,
        (wateredResponse) => {
          if (
            wateredResponse.events.includes(
              "databases.*.collections.*.documents.*.create"
            )
          ) {
            fetchPlantToday();
          }
        }
      );

      fetchPlant();
      fetchPlantToday();

      return () => {
        plantSubscription();
        wateredSubscription();
      };
    }
  }, [user]);

  const filteredPlant =
    selectedZone === 0
      ? plant
      : plant?.filter((p) => p.Plant_zone === selectedZone);

  const zoneList = plant
    ? Array.from(new Set(plant.map((p) => p.Plant_zone))).sort((a, b) => a - b)
    : [];

  const handleLeftAction = async (id: string) => {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRightAction = async (id: string) => {
    const SelectedPlant = filteredPlant?.find((p) => p.$id === id);

    if (!SelectedPlant) return;

    const RepPlant =
      filteredPlant?.find(
        (p) => p.Plant_zone === SelectedPlant?.Plant_zone && p.plant_sno === 1
      ) || SelectedPlant;

    const plantsInZone =
      filteredPlant?.filter(
        (p) => p.Plant_zone === SelectedPlant?.Plant_zone
      ) || [];

    try {
      if (!user || wateredZone?.includes(Number(SelectedPlant?.Plant_zone)))
        return;

      await triggerWatering(
        SelectedPlant?.Plant_zone,
        RepPlant.watering_duration_in_min,
        plantsInZone
      );
    } catch (error) {
      console.log(error);
    }
  };

  const rightAction = (zone: number) => (
    <View style={styles.rightAction}>
      {isZoneWatered(zone) ? (
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          {" "}
          Watered! {"\n"} Today
        </Text>
      ) : (
        <MaterialCommunityIcons
          name="check-circle-outline"
          size={32}
          color="#fff"
        />
      )}
    </View>
  );

  const leftAction = () => (
    <View style={styles.leftAction}>
      <MaterialCommunityIcons name="trash-can-outline" size={32} color="#fff" />
    </View>
  );

  const isZoneWatered = (zone: number) => {
    return wateredZone?.includes(Number(zone));
  };

 
  const activate = async () => {
    if (!system) {
      if (!Ip) {
        // If IP is missing, navigate to set it

        router.replace("/initializeIp");
        console.log(Ip);
        return; // Don't proceed with the fetch until IP is set
      }

      try {
        const response = await fetch(`http://${Ip}:5000/set_user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user?.$id,
          }),
        });

        setSystem((prev) => !prev);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await fetch(`http://${Ip}:5000/set_user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: "",
          }),
        });
        setSystem((prev) => !prev);
      } catch (error) {
        console.error(error);
      }
    }
  };


  const triggerWatering = async (
    zoneId: number,
    durationMinutes: number,
    plantsInZone: plant[]
  ) => {
    try {
      const response = await fetch(`http://${Ip}:5000/water_zone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },

        body: JSON.stringify({
          user_id: user?.$id,
          zone_id: zoneId,
          duration_minutes: durationMinutes,
          plants_in_zone: plantsInZone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Watering request successful:", data);
        // Update UI with success message
      } else {
        console.error("Watering request failed:", data.message);
        // Show error message
      }
    } catch (error) {
      console.error("Network error during watering request:", error);
    }
  };



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          variant="headlineSmall"
          style={{
            color: theme.colors.inversePrimary,

            fontWeight: "bold",

            flex: 1, // Title takes available space
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          My Plants
        </Text>

        <Button
          mode="outlined"
          onPress={activate}
          icon={system ? "lightbulb-on" : "lightbulb-off"}
          theme={{
            colors: !system
              ? { outline: "red", primary: "red" }
              : { outline: "green", primary: "green" },
          }}
          style={{ marginHorizontal: 8 }}
        >
          {system ? "AI Online " : "AI Offline"}
        </Button>

        <Button
          mode="contained"
          onPress={signout}
          icon={"logout"}
          style={{ marginTop: 0, marginLeft: 8 }}
        >
          Sign Out
        </Button>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 2 }}
        >
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={styles.buttonArray}>
              <Button
                mode={selectedZone === 0 ? "contained" : "outlined"}
                onPress={() => setSelectedZone(0)}
                style={{ height: 40 }}
              >
                All
              </Button>

              {zoneList.map((zone, key) => (
                <Button
                  mode={zone === selectedZone ? "contained" : "outlined"}
                  onPress={() => setSelectedZone(zone)}
                  key={key}
                  style={{ height: 40 }}
                >
                  {zone}
                </Button>
              ))}
            </View>
          </ScrollView>
              {selectedZone!==0 && reportIndicator && <View style={{backgroundColor:"#E0F7FA"}}>
              <TouchableOpacity 
              onPress={()=>setShowReport(prev=>!prev)}
              style={{paddingVertical:8}}
              >
                <View style={styles.cardRow}>
                <Text style={{color:report?(report.status!=="healthy"? "red":"black"):"black" , fontWeight:"bold"}}>
                  {showReport?(<><MaterialCommunityIcons 
                                  name="arrow-up-drop-circle" 
                                  size={12}/>
                                   "Hide Report"</>):
                                   (<><MaterialCommunityIcons 
                                   name="arrow-down-drop-circle" 
                                   size={12} /> Show Report</>)
                                   }
                </Text>
                <TouchableOpacity onPress={()=>setReportIndicator(false)}><AntDesign name="close" size={20} color="black"/></TouchableOpacity>
                </View>
              </TouchableOpacity>
              
              {showReport && (
                <>
                  <View style={styles.cardRow}>
                    <Text style={styles.ReportCardLabel}>Status:</Text>
                    <Text style={styles.cardValue}>{report?.status}</Text>
                  </View>
                  <View style={styles.cardRow}>
                    <Text style={styles.ReportCardLabel}>Confidence:</Text>
                    <Text style={styles.cardValue}>{report?.confidence.toFixed(3)}</Text>
                  </View>
                  <View style={styles.cardRow}>
                    <Text style={styles.ReportCardLabel}>Checked at :</Text>
                    <Text style={styles.cardValue}>
                              {report?.report_time? new Date(report?.report_time).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              ): "Not reported yet"}
                            </Text>
                  </View>
                </>
              )}
              </View>}
          {filteredPlant?.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No plants yet{"\n"} Add your first plant now{" "}
              </Text>
            </View>
          ) : (
            filteredPlant?.map((p, key) => {
              // const minSerial = Math.min(...filteredPlant.map((p) => (p.plant_sno)))

              return (
                <Swipeable
                  ref={(ref) => {
                    swipeableRefs.current[p.$id] = ref;
                  }}
                  key={key}
                  overshootLeft={false}
                  overshootRight={false}
                  renderLeftActions={leftAction}
                  renderRightActions={() => rightAction(p.Plant_zone)}
                  onSwipeableOpen={(direction) => {
                    if (direction === "left") {
                      handleLeftAction(p.$id);
                    } else if (direction === "right") {
                      handleRightAction(p.$id);
                    }

                    swipeableRefs.current[p.$id]?.close();
                  }}
                >
                  <Surface
                    style={[
                      styles.card,
                      isZoneWatered(p.Plant_zone) && styles.cardCompleted,
                    ]}
                    elevation={3}
                  >
                    <View style={styles.cardContent}>
                      <View style={styles.cardHeader}>
                        <View>
                          <Text style={styles.cardTitle}>
                            {p.Plant_name}

                            {p.plant_sno === 1 && (
                              <AntDesign name="star" size={24} color="orange" />
                            )}
                          </Text>

                          <Text style={styles.cardSubtitle}>
                            Species:{" "}
                            <Text style={{ color: "#4e8d7c" }}>
                              {p.species}
                            </Text>
                          </Text>
                        </View>

                        <Image
                          source={{
                            uri: p.url
                              ? p.url
                              : "https://bustaniplantfarm.com/wp-content/uploads/2022/06/plant_placeholder.png",
                          }}
                          style={{
                            width: 80,
                            height: 80,
                            backgroundColor: "#eee",
                          }}
                        />
                      </View>

                      <Text style={styles.cardDesc}>{p.plant_desc}</Text>

                      <TouchableOpacity
                        onPress={() =>
                          setExpandedCard(expandedCard === p.$id ? null : p.$id)
                        }
                        style={{ paddingVertical: 8 }}
                      >
                        <Text style={{ color: "#4e8d7c", fontWeight: "bold" }}>
                          {expandedCard === p.$id
                            ? "Hide Details "
                            : "Show Details"}
                        </Text>
                      </TouchableOpacity>

                      {expandedCard === p.$id && (
                        <>
                          <View style={styles.cardRow}>
                            <Text style={styles.cardLabel}>Zone:</Text>
                            <Text style={styles.cardValue}>{p.Plant_zone}</Text>
                          </View>

                          <View style={styles.cardRow}>
                            <Text style={styles.cardLabel}>Serial no:</Text>
                            <Text style={styles.cardValue}> {p.plant_sno}</Text>
                          </View>

                          <View style={styles.cardRow}>
                            <Text style={styles.cardLabel}>Last Watered:</Text>
                            <Text style={styles.cardValue}>
                              {new Date(p.last_watered).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </Text>
                          </View>

                          <View style={styles.cardRow}>
                            <Text style={styles.cardLabel}>Day of Entry:</Text>
                            <Text style={styles.cardValue}>
                              {new Date(p.Day_of_entry).toLocaleDateString()}
                            </Text>
                          </View>
                        </>
                      )}
                    </View>
                  </Surface>
                </Swipeable>
              );
            })
          )}
        </ScrollView>
      </View>
    </View>
  );
}
