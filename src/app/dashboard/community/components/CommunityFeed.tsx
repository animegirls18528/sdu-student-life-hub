"use client";

import { useState } from "react";
import Image from "next/image";
import { createPost, toggleLike, createComment, deletePost, updatePost } from "@/app/actions/community";
import { Send, Image as ImageIcon, Heart, MessageCircle, MoreHorizontal, Trash2, Loader2, X, Sparkles, TrendingUp, Users, Edit2, Check, X as XIcon } from "lucide-react";
import Link from "next/link";

function formatTime(dateString: Date) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "เมื่อสักครู่";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} นาทีที่แล้ว`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ชั่วโมงที่แล้ว`;
  return date.toLocaleDateString('th-TH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function CommunityFeed({ initialPosts, currentUser }: { initialPosts: any[], currentUser: any }) {
  const [posts, setPosts] = useState(initialPosts);
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState<File | null>(null);
  const [postImagePreview, setPostImagePreview] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  // Edit Post State
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPostImage(file);
      setPostImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setPostImage(null);
    setPostImagePreview(null);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() && !postImage) return;

    setIsPosting(true);
    const formData = new FormData();
    formData.append("content", postContent);
    if (postImage) {
      formData.append("file", postImage);
    }

    const res = await createPost(formData);
    if (res.success && res.post) {
      const newPost = {
        ...res.post,
        author: { id: currentUser.id, name: currentUser.name, imageUrl: currentUser.imageUrl, role: currentUser.role },
        likes: [],
        comments: []
      };
      setPosts([{...newPost, isNew: true}, ...posts]);
      setPostContent("");
      removeImage();
    } else {
      alert(res.error || "Failed to create post");
    }
    setIsPosting(false);
  };

  const handleLike = async (postId: string) => {
    setPosts(currentPosts => currentPosts.map(p => {
      if (p.id === postId) {
        const hasLiked = p.likes.some((l: any) => l.userId === currentUser.id);
        if (hasLiked) {
          return { ...p, likes: p.likes.filter((l: any) => l.userId !== currentUser.id) };
        } else {
          return { ...p, likes: [...p.likes, { userId: currentUser.id }], justLiked: true };
        }
      }
      return p;
    }));

    await toggleLike(postId);
  };

  const handleCreateComment = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setIsCommenting(true);
    const res = await createComment(postId, commentContent);
    if (res.success && res.comment) {
      const newComment = {
        ...res.comment,
        author: { id: currentUser.id, name: currentUser.name, imageUrl: currentUser.imageUrl }
      };
      
      setPosts(currentPosts => currentPosts.map(p => {
        if (p.id === postId) {
          return { ...p, comments: [...p.comments, newComment] };
        }
        return p;
      }));
      setCommentContent("");
    } else {
      alert(res.error || "Failed to comment");
    }
    setIsCommenting(false);
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("คุณต้องการลบโพสต์นี้ใช่หรือไม่?")) return;
    
    setPosts(currentPosts => currentPosts.filter(p => p.id !== postId));
    await deletePost(postId);
  };

  const startEditing = (post: any) => {
    setEditingPostId(post.id);
    setEditingContent(post.content);
  };

  const cancelEditing = () => {
    setEditingPostId(null);
    setEditingContent("");
  };

  const handleUpdatePost = async (postId: string) => {
    if (!editingContent.trim()) return;
    setIsUpdating(true);
    const res = await updatePost(postId, editingContent);
    if (res.success && res.post) {
      setPosts(currentPosts => currentPosts.map(p => {
        if (p.id === postId) {
          return { ...p, content: editingContent };
        }
        return p;
      }));
      setEditingPostId(null);
    } else {
      alert(res.error || "Failed to update post");
    }
    setIsUpdating(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Feed Column */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Create Post Form */}
        <div className="bg-white rounded-3xl border border-zinc-100 p-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.08)] focus-within:border-blue-100">
          <div className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 p-5 rounded-[1.4rem]">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                {currentUser.imageUrl ? (
                  <Image src={currentUser.imageUrl} alt={currentUser.name} width={48} height={48} className="rounded-2xl object-cover w-12 h-12 shadow-sm border border-white" />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-200">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
              </div>
              <form onSubmit={handleCreatePost} className="flex-1 space-y-3">
                <textarea
                  placeholder={`มีอะไรมาแชร์ให้เพื่อนๆ ฟังไหม ${currentUser.name.split(' ')[0]}? ✨`}
                  className="w-full bg-white/70 border border-zinc-200/50 rounded-2xl px-5 py-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white resize-none transition-all placeholder:text-zinc-400 text-zinc-800 text-lg shadow-inner"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
                
                {postImagePreview && (
                  <div className="relative inline-block mt-2 group animate-in fade-in zoom-in duration-300">
                    <img src={postImagePreview} alt="Preview" className="max-h-[300px] rounded-2xl border-4 border-white shadow-md object-cover" />
                    <button 
                      type="button" 
                      onClick={removeImage}
                      className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 hover:scale-110 hover:bg-red-600 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <label className="cursor-pointer inline-flex items-center text-sm font-semibold text-blue-600 hover:bg-blue-100/50 px-4 py-2.5 rounded-xl transition-all active:scale-95">
                      <ImageIcon className="w-5 h-5 mr-2" />
                      เพิ่มรูปภาพ
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={isPosting || (!postContent.trim() && !postImagePreview)}
                    className="inline-flex items-center bg-zinc-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-200 active:scale-95"
                  >
                    {isPosting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                    โพสต์เลย
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-8">
          {posts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-zinc-200 shadow-sm flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-zinc-800 mb-2">ยังไม่มีเรื่องราวใหม่ๆ</h3>
              <p className="text-zinc-500">มาเป็นคนแรกที่แชร์เรื่องราวดีๆ ในวันนี้กันเถอะ!</p>
            </div>
          ) : (
            posts.map((post) => {
              const hasLiked = post.likes.some((l: any) => l.userId === currentUser.id);
              const canDelete = post.author.id === currentUser.id || currentUser.role === "ADMIN" || currentUser.role === "SUPER_ADMIN";

              return (
                <div key={post.id} className={`bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden transition-all hover:shadow-md ${post.isNew ? 'animate-in fade-in slide-in-from-top-4 duration-500' : ''}`}>
                  {/* Post Header */}
                  <div className="p-6 flex justify-between items-start">
                    <div className="flex gap-4">
                      {post.author.imageUrl ? (
                        <Image src={post.author.imageUrl} alt={post.author.name} width={48} height={48} className="rounded-2xl object-cover w-12 h-12 shadow-sm border border-zinc-100" />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 text-white flex items-center justify-center font-bold shadow-sm">
                          {post.author.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-zinc-900 text-lg flex items-center gap-2">
                          {post.author.name}
                          {post.author.role === "TEACHER" && <span className="text-[10px] bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-2 py-0.5 rounded-full shadow-sm">อาจารย์</span>}
                          {post.author.role === "ADMIN" && <span className="text-[10px] bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full shadow-sm">Admin</span>}
                        </div>
                        <div className="text-sm text-zinc-500 flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          {formatTime(post.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    {canDelete && (
                      <div className="relative group">
                        <button className="text-zinc-400 hover:text-zinc-900 p-2 rounded-xl hover:bg-zinc-100 transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        <div className="absolute right-0 mt-1 w-36 bg-white rounded-2xl shadow-xl border border-zinc-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 overflow-hidden translate-y-2 group-hover:translate-y-0">
                          <button 
                            onClick={() => startEditing(post)}
                            className="w-full text-left px-4 py-3 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 flex items-center transition-colors border-b border-zinc-100"
                          >
                            <Edit2 className="w-4 h-4 mr-2" /> แก้ไขโพสต์
                          </button>
                          <button 
                            onClick={() => handleDeletePost(post.id)}
                            className="w-full text-left px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center transition-colors"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> ลบโพสต์
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Post Content */}
                  <div className="px-6 pb-4">
                    {editingPostId === post.id ? (
                      <div className="space-y-3">
                        <textarea
                          className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-all text-zinc-800"
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          autoFocus
                        />
                        <div className="flex items-center gap-2 justify-end">
                          <button 
                            onClick={cancelEditing}
                            disabled={isUpdating}
                            className="px-4 py-2 rounded-lg text-sm font-semibold text-zinc-500 hover:bg-zinc-100 transition-colors disabled:opacity-50"
                          >
                            ยกเลิก
                          </button>
                          <button 
                            onClick={() => handleUpdatePost(post.id)}
                            disabled={isUpdating || !editingContent.trim() || editingContent === post.content}
                            className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            บันทึก
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-zinc-800 text-[1.05rem] leading-relaxed whitespace-pre-wrap">{post.content}</p>
                    )}
                  </div>

                  {/* Post Image */}
                  {post.imageUrl && (
                    <div className="px-6 pb-4">
                      <div className="rounded-2xl overflow-hidden border border-zinc-100 bg-zinc-50 max-h-[500px] flex items-center justify-center group relative cursor-pointer">
                        <img src={post.imageUrl} alt="Post attachment" className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                      </div>
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="px-6 py-4 border-t border-zinc-50 flex items-center gap-4 bg-zinc-50/50">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className={`group flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-90 ${hasLiked ? 'text-pink-600 bg-pink-50 hover:bg-pink-100' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'}`}
                    >
                      <Heart className={`w-5 h-5 mr-2 transition-transform duration-300 ${hasLiked ? 'fill-pink-500 scale-110' : 'group-hover:scale-110'} ${post.justLiked ? 'animate-bounce' : ''}`} />
                      <span className="text-base">{post.likes.length > 0 ? post.likes.length : ''}</span>
                      <span className="hidden sm:inline ml-2">{hasLiked ? 'ชื่นชอบ' : 'ถูกใจ'}</span>
                    </button>
                    
                    <button 
                      onClick={() => setActiveCommentPost(activeCommentPost === post.id ? null : post.id)}
                      className="group flex items-center px-4 py-2 rounded-xl text-sm font-bold text-zinc-600 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-90"
                    >
                      <MessageCircle className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110" />
                      <span className="text-base">{post.comments.length > 0 ? post.comments.length : ''}</span>
                      <span className="hidden sm:inline ml-2">ความคิดเห็น</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {activeCommentPost === post.id && (
                    <div className="bg-zinc-50/80 p-6 border-t border-zinc-100 animate-in fade-in slide-in-from-top-2 duration-200">
                      
                      {/* Add Comment */}
                      <form onSubmit={(e) => handleCreateComment(e, post.id)} className="flex gap-3 mb-6">
                        <div className="flex-shrink-0 mt-0.5">
                          {currentUser.imageUrl ? (
                            <Image src={currentUser.imageUrl} alt={currentUser.name} width={36} height={36} className="rounded-xl object-cover w-9 h-9 border border-zinc-200 shadow-sm" />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                              {currentUser.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 relative group">
                          <input
                            type="text"
                            placeholder="เขียนความคิดเห็นที่สร้างสรรค์..."
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            className="w-full bg-white border border-zinc-200 shadow-sm rounded-2xl pl-5 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-zinc-300"
                          />
                          <button 
                            type="submit" 
                            disabled={!commentContent.trim() || isCommenting}
                            className="absolute right-2 top-2 text-white bg-blue-600 p-1.5 rounded-xl hover:bg-blue-700 hover:shadow-md hover:shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-90"
                          >
                            {isCommenting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          </button>
                        </div>
                      </form>

                      {/* Existing Comments */}
                      {post.comments.length > 0 && (
                        <div className="space-y-5">
                          {post.comments.map((comment: any) => (
                            <div key={comment.id} className="flex gap-3">
                              {comment.author.imageUrl ? (
                                <Image src={comment.author.imageUrl} alt={comment.author.name} width={36} height={36} className="rounded-xl object-cover w-9 h-9 border border-white shadow-sm mt-1 flex-shrink-0" />
                              ) : (
                                <div className="w-9 h-9 rounded-xl bg-white text-blue-700 flex items-center justify-center font-bold border border-zinc-200 shadow-sm mt-1 flex-shrink-0 text-xs">
                                  {comment.author.name.charAt(0)}
                                </div>
                              )}
                              <div>
                                <div className="bg-white px-5 py-3 rounded-2xl rounded-tl-sm border border-zinc-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] inline-block">
                                  <span className="font-bold text-[0.9rem] text-zinc-900 block mb-0.5 hover:underline cursor-pointer">{comment.author.name}</span>
                                  <span className="text-zinc-700 text-[0.95rem] leading-relaxed whitespace-pre-wrap">{comment.content}</span>
                                </div>
                                <div className="text-[11px] font-medium text-zinc-400 mt-1.5 ml-2">
                                  {formatTime(comment.createdAt)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>


    </div>
  );
}
