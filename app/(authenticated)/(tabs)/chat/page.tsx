import { ChatList } from "@/components/chat/chat-list";
import { PageHeader } from "@/components/page-header";
import { SearchForm } from "@/components/search-form";

export default function Page() {
    return (
        <div className="container max-w-2xl mx-auto p-4 pb-20 space-y-6">
            <PageHeader title="Messages" />
            <SearchForm placeholder="Search messages" />
            <ChatList />
        </div>
    );
}