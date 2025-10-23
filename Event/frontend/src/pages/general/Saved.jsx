import React, { useEffect, useState } from 'react'
import '../../styles/reels.css'
import axios from 'axios'
import ReelFeed from '../../components/ReelFeed'

const Saved = () => {
    const [ videos, setVideos ] = useState([])

    useEffect(() => {
        axios.get("http://localhost:3000/api/event/save", { withCredentials: true })
            .then(response => {
                const savedevents = response.data.savedevents.map((item) => ({
                    _id: item.event._id,
                    video: item.event.video,
                    description: item.event.description,
                    likeCount: item.event.likeCount,
                    savesCount: item.event.savesCount,
                    commentsCount: item.event.commentsCount,
                    eventPartner: item.event.eventPartner,
                }))
                setVideos(savedevents)
            })
    }, [])

    const removeSaved = async (item) => {
        try {
            await axios.post("http://localhost:3000/api/event/save", { eventId: item._id }, { withCredentials: true })
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: Math.max(0, (v.savesCount ?? 1) - 1) } : v))
        } catch {
            // noop
        }
    }

    return (
        <ReelFeed
            items={videos}
            onSave={removeSaved}
            emptyMessage="No saved videos yet."
        />
    )
}

export default Saved
