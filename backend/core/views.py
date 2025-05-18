from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from core.models import Content, User
from core.serializers import RegisterSerializer, ContentSerializer, UserSerializer
from core.permissions import IsOwnerOrAdmin
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from django.conf import settings


# All user list only admin can see it
class UserListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({"detail": "You do not have permission to perform this action."}, status=status.HTTP_403_FORBIDDEN)
        
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Register
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

# Content List and Create
class ContentListCreateView(generics.ListCreateAPIView):
    queryset = Content.objects.all().order_by('-created_at')
    serializer_class = ContentSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

# Content Retrieve, Update, Delete
class ContentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
    permission_classes = [IsOwnerOrAdmin]

# User Profile
class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

# Logout (JWT token blacklist if enabled)
class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


 
class AIAnalyzeContentView(APIView):
 

    def post(self, request):
        content_id = request.data.get('content_id')
        text = request.data.get('text')

        if not content_id or not text:
            return Response({"error": "Missing content_id or text."}, status=400)

        try:
            content = Content.objects.get(pk=content_id)
        except Content.DoesNotExist:
            return Response({"error": "Content not found."}, status=404)

        try:
            # Load Groq LLM
            llm = ChatGroq(
                model="deepseek-r1-distill-llama-70b",   
                api_key=settings.GROQ_API_KEY,
            )

            # Define prompt template
            prompt = ChatPromptTemplate.from_template("""
                    Given the following text, perform:
                    1. A concise summary.
                    2. Sentiment analysis (Positive, Neutral, or Negative).
                    3. Extract 3-5 key topics.

                    Text:
                    {text}

                    Respond in the following format:
                    Summary: <your summary>
                    Sentiment: <sentiment>
                    Topics:
                    - Topic 1
                    - Topic 2
                    - ...
                    """)

            chain = prompt | llm
            result = chain.invoke({"text": text})
            ai_response = result.content.strip()

            # Parse output
            lines = ai_response.splitlines()
            summary = ""
            sentiment = ""
            topics = []

            for line in lines:
                if line.lower().startswith("summary:"):
                    summary = line.split(":", 1)[1].strip()
                elif line.lower().startswith("sentiment:"):
                    sentiment = line.split(":", 1)[1].strip().lower()
                elif line.startswith("-"):
                    topics.append(line.strip("-• ").strip())

            return Response({
                "summary": summary,
                "sentiment": sentiment,
                "topics": topics
            }, status=200)

        except Exception as e:
            return Response({"error": f"AI analysis failed: {str(e)}"}, status=500)