# My Garden: Smart Plant Care Made Easy

Keeping plants alive is harder than it looks—so I built an app to do the heavy lifting.

**My Garden** is a mobile dashboard that connects your smartphone to real soil (and a Raspberry Pi). Built with React Native and Expo, it lets you water plants with a swipe, or hand everything over to an AI that knows what your plants need. No more dead leaves. No more guilt.

## The Idea

Most plant apps are just fancy notebooks. I wanted something that actually *does* something. So I built a system that talks to real hardware—a Raspberry Pi with moisture sensors and water pumps—and lets you control it all from your phone. Want to manually water your plants? Swipe the card. Want to let AI handle it? Toggle "AI Mode" and let the system decide when to water based on real sensor data.

## What You Can Do

**🌱 Smart Watering**  
Swipe left on a plant card and boom—water flows. It's smooth, it's intuitive, and your Raspberry Pi gets the signal in real time.

**🤖 AI Mode (The Lazy Option)**  
Turn on "AI Online" and let a machine learning model take the wheel. It analyzes soil moisture, plant health, and weather patterns, then decides when to water. You just check in to see how things are going.

**📡 Hardware Connection**  
There's an IP initialization screen that handles all the networking weirdness. It pings your Raspberry Pi to make sure everything's connected before you start. No more wondering if it's actually working.

**📊 Weekly Health Reports**  
The app pulls data from Appwrite showing you how each plant is doing—health scores, confidence levels, and even photos from your garden camera if you've set one up.

**⚠️ Crash-Proof (Mostly)**  
Network issues? Wrong IP? Instead of the app crashing, you get a friendly notification. The app keeps running and tries again.

## What I Used

- **Frontend**: React Native with Expo and TypeScript
- **Routing**: Expo Router (file-based routing because it just works)
- **Backend**: Appwrite for auth, databases, and file storage
- **UI**: React Native Paper for clean Material Design, Linear Gradient for pretty backgrounds
- **Hardware**: REST API calls to a Flask server on a Raspberry Pi
- **State Management**: React hooks and context (kept it simple)

## Getting Started

### Step 1: Set Up Appwrite

You need an Appwrite instance running somewhere (cloud, local, whatever). Grab your:
- Appwrite endpoint (like `https://your-appwrite.com/v1`)
- Project ID
- API key

Stick these in a `.env` file:

```
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://your-appwrite.com/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
```

### Step 3: Set Up Your Raspberry Pi

The Pi runs a Flask server that listens for water commands. You've got two options here:

**Option A: Roll Your Own**

You'll need:
- Python 3.7+
- Flask
- GPIO libraries (if you're using actual pumps)

Here's a super basic Flask server to get you started:

```python
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/water/<plant_id>', methods=['POST'])
def water_plant(plant_id):
    # Trigger your pump here
    print(f"Watering plant {plant_id}")
    return jsonify({"status": "watering"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

**Option B: Use My Pre-Built Backend (Easier)**

I've already built a backend server for this—it's mocked by default (no hardware needed to test), but ready to wire up real pumps and sensors when you're ready.

Check it out here: [https://github.com/CodRjt/Smart_gardening_system_RasPi_Backend](https://github.com/CodRjt/Smart_gardening_system_RasPi_Backend)

Just clone it, install dependencies, and run it on your Pi. The mocked version is great for testing the whole flow without actual hardware. If you do have the hardware and want to make it real, pull requests are welcome!

### Step 4: Configure Your App

In your app, set the Raspberry Pi IP address in the settings screen. The app will ping it to make sure it's alive before you try to water anything.

### Step 5: Run It

```bash
expo start
```

Then use Expo Go on your phone to scan the QR code. Or build it for Android/iOS if you're feeling fancy.

## How It Actually Works

1. **Manual Mode**: You're looking at your plant on the app, you see it's dry, you swipe. The app sends a POST request to your Raspberry Pi. The Pi triggers the pump. Water flows.

2. **AI Mode**: You flip the toggle, the app asks your local ML model "should I water this plant?" The model checks soil moisture, humidity, temperature, and decides. If yes, it waters. If no, it waits.

3. **Health Reports**: Every week (or whenever you ask), the app fetches a report from Appwrite showing plant status, confidence scores, and historical data. You get a sense of whether your plants are thriving or just surviving.

## Project Structure

```
my-garden/
├── app/                    # Expo Router screens
│   ├── _layout.tsx
│   ├── index.tsx          # Home/dashboard
│   ├── plant/[id].tsx     # Plant details
│   └── settings.tsx       # IP config, preferences
├── src/
│   ├── services/          # API calls
│   ├── hooks/             # Custom React hooks
│   ├── components/        # Reusable UI components
│   └── types/             # TypeScript definitions
├── .env.example
└── package.json
```

## Common Issues & Fixes

**The app can't find my Raspberry Pi**  
- Make sure both your phone and Pi are on the same WiFi network
- Check the IP address you entered—typos happen to everyone
- Ping the Pi from your phone to see if it's reachable

**Swipe to water isn't working**  
- Make sure gesture-handler is properly initialized
- Check your Raspberry Pi logs to see if it's getting the request

**AI mode never waters anything**  
- Check if your ML model is actually running
- Look at the model's decision logs—it might be waiting for specific sensor readings

**App crashes when starting**  
- Check your .env file is set up right
- Make sure Appwrite is running and accessible

## What's Missing (For Now)

- Push notifications when plants need water (coming soon™)
- Mobile responsiveness for tablets
- Watering history graphs (got sidetracked)
- Integration with weather APIs (was gonna do this)

## Contributing

Feel free to fork, break stuff, fix stuff, and send PRs. I'm open to ideas.

## License

MIT License—do what you want with it.

---

**Built with 🌿 and occasional frustration with hardware bugs.**
