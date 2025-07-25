import gradio as gr
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from openai import OpenAI
import os
import numpy as np
import dotenv
from db import crud

dotenv.load_dotenv()
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

client = OpenAI()
qdrant_client = QdrantClient(url="http://localhost:6333")

def sentence2vec(sentence):
    response = client.embeddings.create(
        model="text-embedding-ada-002",
        input=sentence,
        encoding_format="float"
    )
    return np.array(response.data[0].embedding)

def get_reference(question):
    vector = sentence2vec(question)
    
    string = ""
    reference_list = []

    query_result = qdrant_client.search(
    collection_name="skku_doc",
    query_vector= vector,
    limit=3,
    )

    for result in query_result:
        if result.score < 0.7:
            continue
        string += result.payload["text"]
        string += "\n"
        reference_list.append(str(result.id) + "page")

    return string, reference_list

related_list = []

def answer(question):
    relative_docs_string, relative_doc_list = get_reference(question)

    if relative_docs_string == "":
        response = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "system", "content": "You are a helpful assistant that answering user question."},\
                            {"role": "user", "content": question}],
                temperature=0.3)
    
        return response.choices[0].message.content, relative_doc_list
    else:
        response = client.chat.completions.create(
                    model="gpt-4o",
                    messages=[{"role": "system", "content": "You are a helpful assistant that answering user question."},\
                              {"role": "user", "content": "답변은 무슨 일이 있어도 한국어로 부탁해"},\
                                {"role": "user", "content": f"this is document you must reference {relative_docs_string}."},\
                                {"role": "user", "content": question}],
                    temperature=0.3)
        
        return response.choices[0].message.content, relative_doc_list #+ "\n" + "이 답변은 다음 문서를 참고하여 작성되었습니다. " + str(relative_doc_list)

def answer_with_reference(question):
    response = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "system", "content": "You are a helpful assistant that answering user question."},\
                          {"role": "user", "content": "답변은 무슨 일이 있어도 한국어로 부탁해"},\
                        {"role": "user", "content": question}],
                temperature=0.3)
    return response.choices[0].message.content

def chat_summary(string):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "system", "content": "You are a helpful assistant that summarizing chat."},\
                  {"role": "user", "content": "아래 문자는 채팅 로그야 내용을 한국어로 요약해줘 반드시, 그리고 요약은 10글자 이내로 해줘."},
                  {"role": "user", "content": string}],
        temperature=0.3
    )
    return response.choices[0].message.content
