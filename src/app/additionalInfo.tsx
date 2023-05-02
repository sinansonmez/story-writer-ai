import React from "react"
import { Input } from "@chakra-ui/react"

type Props = {
  setCharacter: (character: string) => void,
  setActivity: (activity: string) => void,
  setTheme: (theme: string) => void,
}

const AdditionalInfo = (props: Props) => {
  return (
    <div className="flex flex-col" >
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-500 mr-4" >Character: </span>
        <Input maxLength={20} className="border border-gray-400 rounded-lg p-2 w-56 h-38" placeholder='e.g. Jane' onChange={(e) => props.setCharacter(e.target.value)} />
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-500 mr-4" >Activity: </span>
        <select title="activity" className="border border-gray-400 rounded-lg p-2 bg-white w-56 h-42" placeholder='Select an activity' onChange={(e) => props.setActivity(e.target.value)} >
          <option value=''>Select an activity</option>
          <option value='baseball'> ⚾ Baseball</option>
          <option value='basketball'> 🏀 Basketball</option>
          <option value='biking'> 🚲 Biking</option>
          <option value='climbing'> 🧗 Climbing</option>
          <option value='diving'> 🤿 Diving</option>
          <option value='fishing'> 🎣 Fishing</option>
          <option value='football'> ⚽ Football</option>
          <option value='golfing'> ⛳ Golfing</option>
          <option value='hiking'> 🥾 Hiking</option>
          <option value='kayaking'> 🚣 Kayaking</option>
          <option value='rugby'> 🏉 Rugby</option>
          <option value='running'> 🏃 Running</option>
          <option value='skating'> ⛸ Skating</option>
          <option value='skateboarding'> 🛹 Skateboarding</option>
          <option value='skiing'> ⛷ Skiing</option>
          <option value='snowboarding'> 🏂 Snowboarding</option>
          <option value='surfing'> 🏄 Surfing</option>
          <option value='swimming'> 🏊 Swimming</option>
          <option value='tennis'> 🎾 Tennis</option>
          <option value='volleyball'> 🏐 Volleyball</option>
        </select>
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-500 mr-4" >Theme: </span>
        <select title="topic" className="border border-gray-400 rounded-lg p-2 bg-white w-56 h-42" onChange={(e) => props.setTheme(e.target.value)} >
          <option value=''>Select a theme</option>
          <option value='animals'> 🐶 Animals</option>
          <option value='art'> 🎨 Art</option>
          <option value='books'> 📚 Books</option>
          <option value='robots'> 🤖 Robots</option>
          <option value='space'> 🚀 Space</option>
          <option value='sports'> ⚽ Sports</option>
          <option value='technology'> 💻 Technology</option>
          <option value='travel'> 🌎 Travel</option>
        </select>
      </div>
    </div>
  )
}

export default AdditionalInfo
