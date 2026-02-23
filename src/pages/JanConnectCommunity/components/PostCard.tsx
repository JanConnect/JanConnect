import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  MapPin,
  Shield,
  Award,
} from "lucide-react";
import VideoCard from "../components/VideoCard";

export interface Post {
  id: number;
  title: string;
  content: string;
  community: string;
  author: string;
  authorAvatar: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  shares: number;
  awards: string[];
  flair?: string;
  flairColor?: string;
  videoUrl?: string;
  image?: string;
  isPinned?: boolean;
  location?: string;
}

interface PostCardProps {
  post: Post;
  isActiveVideo: boolean;
  onVideoVisible: (id: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, isActiveVideo, onVideoVisible }) => {
  const [voteState, setVoteState] = useState<"up" | "down" | null>(null);
  const [votes, setVotes] = useState(post.upvotes - post.downvotes);
  const [saved, setSaved] = useState(false);

  const handleVote = (type: "up" | "down") => {
    if (voteState === type) {
      setVotes(post.upvotes - post.downvotes);
      setVoteState(null);
    } else {
      const base = post.upvotes - post.downvotes;
      setVotes(type === "up" ? base + 1 : base - 1);
      setVoteState(type);
    }
  };

  const formatNumber = (n: number) => (Math.abs(n) >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString());

  const flairClass = post.flairColor ? `flair-${post.flairColor}` : "";

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      {/* Pinned indicator */}
      {post.isPinned && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2 pl-14">
          <Shield className="w-3.5 h-3.5 text-primary" />
          <span className="font-medium">Pinned by moderators</span>
        </div>
      )}

      <div className="flex gap-3">
        {/* Vote column */}
        <div className="flex flex-col items-center gap-0.5 pt-1 min-w-[40px]">
          <button
            onClick={() => handleVote("up")}
            className={`vote-button ${voteState === "up" ? "active-up" : "text-vote-neutral"}`}
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <span className={`text-sm font-semibold tabular-nums ${
            voteState === "up" ? "text-vote-up" : voteState === "down" ? "text-vote-down" : "text-foreground"
          }`}>
            {formatNumber(votes)}
          </span>
          <button
            onClick={() => handleVote("down")}
            className={`vote-button ${voteState === "down" ? "active-down" : "text-vote-neutral"}`}
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Meta line */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap mb-1.5">
            <img src={post.authorAvatar} alt="" className="w-5 h-5 rounded-full" />
            <span className="font-semibold text-foreground/80">r/{post.community}</span>
            <span>·</span>
            <span>u/{post.author}</span>
            <span>·</span>
            <span>{post.timestamp}</span>
            {post.location && (
              <>
                <span>·</span>
                <span className="flex items-center gap-0.5">
                  <MapPin className="w-3 h-3" />
                  {post.location}
                </span>
              </>
            )}
            {post.flair && (
              <span className={`flair-badge ${flairClass}`}>{post.flair}</span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-display font-semibold text-foreground leading-snug mb-1.5 cursor-pointer hover:text-primary transition-colors">
            {post.title}
          </h3>

          {/* Body */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
            {post.content}
          </p>

          {/* Media */}
          {post.videoUrl && (
            <div className="mb-3" onMouseEnter={() => onVideoVisible(post.id)}>
              <VideoCard videoUrl={post.videoUrl} isActive={isActiveVideo} />
            </div>
          )}
          {post.image && !post.videoUrl && (
            <div className="mb-3 rounded-xl overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full object-cover max-h-96" />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 -ml-2">
            <button className="action-button">
              <MessageCircle className="w-4 h-4" />
              <span>{formatNumber(post.comments)}</span>
            </button>
            <button className="action-button">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className={`action-button ${saved ? "text-primary" : ""}`}
            >
              <Bookmark className="w-4 h-4" fill={saved ? "currentColor" : "none"} />
              <span>Save</span>
            </button>
            {post.awards.length > 0 && (
              <div className="flex items-center gap-1 ml-1">
                {post.awards.map((award, i) => (
                  <Award key={i} className="w-4 h-4 text-primary" />
                ))}
              </div>
            )}
            <button className="action-button ml-auto">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default PostCard;
