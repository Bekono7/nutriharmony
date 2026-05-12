import { useEffect, useState } from "react";
import { Star, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { commentsApi, type Comment } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface CommentsSectionProps {
  dishId: number;
}

const CommentsSection = ({ dishId }: CommentsSectionProps) => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await commentsApi.list(dishId);
        if (!cancelled) setComments(data.results);
      } catch {
        if (!cancelled) setComments([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [dishId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const { data } = await commentsApi.create(dishId, {
        rating,
        text: newComment.trim(),
      });
      setComments([data, ...comments]);
      setNewComment("");
      setRating(5);
      setShowForm(false);
      toast({ title: "Commentaire ajouté", description: "Merci pour votre avis !" });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err?.response?.data?.detail || "Impossible d'ajouter le commentaire",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-8">
        <p className="text-muted-foreground">Chargement des commentaires...</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Commentaires ({comments.length})
        </h3>
        {isAuthenticated && (
          <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Annuler" : "Écrire un commentaire"}
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="mb-3">
            <label className="block text-sm font-medium mb-2">Note</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 cursor-pointer ${
                      star <= rating ? "fill-accent text-accent" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <Textarea
              placeholder="Partagez votre expérience avec ce plat..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              required
            />
          </div>
          <Button type="submit" disabled={submitting || !newComment.trim()}>
            <Send className="h-4 w-4 mr-2" />
            {submitting ? "Envoi..." : "Envoyer"}
          </Button>
        </form>
      )}

      {comments.length === 0 ? (
        <p className="text-muted-foreground">Aucun commentaire pour ce plat. Soyez le premier !</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-border pb-4">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < comment.rating ? "fill-accent text-accent" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-foreground mb-2">{comment.text}</p>
              <p className="text-sm text-muted-foreground">
                {comment.user_name || comment.user_email} •{" "}
                {new Date(comment.created_at).toLocaleDateString("fr-FR")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;