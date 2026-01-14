-- Supabase vector schema for NotionNext embeddings (4096 dims)
create extension if not exists vector;

create table if not exists documents (
  id bigserial primary key,
  source_id text not null,
  chunk_index integer not null,
  content text,
  metadata jsonb,
  embedding vector(4096)
);

create unique index if not exists documents_source_chunk_unique
  on documents (source_id, chunk_index);

create index if not exists documents_embedding_idx
  on documents using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create or replace function match_documents (
  query_embedding vector(4096),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  source_id text,
  chunk_index integer,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.source_id,
    documents.chunk_index,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;
