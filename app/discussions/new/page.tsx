import { getCategories } from "@/lib/queries";
import { auth } from "@/lib/auth";
import { NewThreadForm } from "@/components/discussion/NewThreadForm";

export default async function NewDiscussionPage() {
  const session = await auth();
  const categories = await getCategories();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cyan-300 font-orbitron tracking-wide">
          发起讨论
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          分享你对小说创作的想法与建议
        </p>
      </div>

      <NewThreadForm
        categories={categories}
        isLoggedIn={!!session?.user}
      />
    </div>
  );
}
