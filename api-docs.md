External docs for relevace / article generation api usage: 


<short-docs>
Use tool in your product via API
Integrate cutting-edge AI seamlessly into your product and power features with our tool API.
Advanced: Note that synchronous triggers only last for 30 seconds. If your tool is long running, you will need to make a call to the asynchronous endpoint. See here for more information.
Endpoint
POST
Copy
https://api-d7b62b.stack.tryrelevance.com/latest/studios/e6bd882c-b1a4-4d33-a9fc-4f32d7f3aa32/trigger_limited
Generate API key (Authorization Token)
Make sure to save your API key somewhere safe. Once you generate it, you won't be able to see them again for security reasons.
You can also regenerate one at any time.
For more information about using your own API keys and where to find your other API keys, see here.
Copy
Authorization token
fa7659c4878d-4a1f-aff2-3ea6d1ffabf9:sk-ZDEyNzAzZTMtMDA4Yy00YmUyLTk0NmQtYWQ0NjJmMzgzZTdl
Request body
Copy
{
"params": 
{
"dataset": 
"",
"keyword": 
"",
"intern": 
"",
"doelgroep": 
"",
"schrijfstijl": 
"",
"words": 
""
},
"project": 
"fa7659c4878d-4a1f-aff2-3ea6d1ffabf9"
}
Sample Curl
Remember to replace 'YOUR_API_KEY' with the generated API key above
Copycurl -X POST -H "Content-Type: application/json"  -H "Authorization:  YOUR_API_KEY" -d '{"params":{"dataset":"","keyword":"","intern":"","doelgroep":"","schrijfstijl":"","words":""},"project":"fa7659c4878d-4a1f-aff2-3ea6d1ffabf9"}' https://api-d7b62b.stack.tryrelevance.com/latest/studios/e6bd882c-b1a4-4d33-a9fc-4f32d7f3aa32/trigger_limited
Sample Javascript
Remember to replace 'YOUR_API_KEY' with the generated API key above
Copyfetch('https://api-d7b62b.stack.tryrelevance.com/latest/studios/e6bd882c-b1a4-4d33-a9fc-4f32d7f3aa32/trigger_limited', {
  method: "POST",
  headers: {"Content-Type":"application/json","Authorization":"YOUR_API_KEY"},
  body: JSON.stringify({"params":{"dataset":"","keyword":"","intern":"","doelgroep":"","schrijfstijl":"","words":""},"project":"fa7659c4878d-4a1f-aff2-3ea6d1ffabf9"})
})
Sample Python
Remember to replace 'YOUR_API_KEY' with the generated API key above
Copyrequests.post('https://api-d7b62b.stack.tryrelevance.com/latest/studios/e6bd882c-b1a4-4d33-a9fc-4f32d7f3aa32/trigger_limited', 
  headers={"Content-Type":"application/json","Authorization":"YOUR_API_KEY"},
  data=json.dumps({"params":{"dataset":"","keyword":"","intern":"","doelgroep":"","schrijfstijl":"","words":""},"project":"fa7659c4878d-4a1f-aff2-3ea6d1ffabf9"})
)


</short-docs>


This is the doc for longer taking jobs:
<long-docs>
Asynchronous Execution
How to run async calls for long running tools

​
API authorization set up
When on API keys page, scroll down and you will see the Region code and your Project Id.Region

To generate your Relevance API key, click on "Create new secret key", with the role "Admin". Click on "Generate API key". Copy the values shown on the modal.

Authorization token
API key
Region
Project


Authorization tokens are formed by combining Project Id:API Key.

Either directly copy the Authorization token from the API page or use the Project id and API key combination as shown in the snippet below:


project_id = "YOUR_PROJECT_ID" # Can be found in the API Keys page
authorization_token = f"{YOUR_PROJECT_ID}:{YOUR_API_KEY}"   # Both values can be found in the API Keys page
region = "YOUR_REGION"       # Can be found in the API Keys page
base_url = f"https://api-{region}.stack.tryrelevance.com/latest"
headers = {
  "Authorization": authorization_token,
}
​
Tool ID
There are different ways to find the ID of a Tool. The easiest way is to use the URL. For example when on the Tool and Use tab, the component before use/app and after project ID is the tool ID. The string below shows the URL structure:

https://app.relevanceai.com/notebook/{region}/{project_id}/{tool_id}/use/app


tool_id = "YOUR_TOOL_ID"
​
Make async call for long running tool
Provide tool_id in the code below to trigger a task and check the progress:


import requests

body = {
  "params":{
    "blog_request":"hello"
  },
  "project":project_id
}

response = requests.post(
  base_url + f"studios/{tool_id}/trigger_async", 
  headers=headers, 
  json=body
)

# Extract the tools job id, so we can check its progress
job = response.json()
job_id = job['job_id']

poll_url = base_url + f"/studios/{tool_id}/async_poll/{job_id}?ending_update_only=true"

done = False
# Every 3 seconds, check if the tool had finished by calling the poll endpoint
while not done:
    poll_response = requests.get(poll_url, headers=headers).json()
    if poll_response['type'] == "complete" or poll_response['type'] == 'failed':
        done = True
        break
    time.sleep(3)

poll_response
​
Which Relevance AI Endpoints can we use?
This is our API documentation which shows all Relevance AI Endpoints. You can make requests to any endpoint that doesn’t require organization level permissions. The endpoints that require org level permissions will mention the word “Organization” somewhere in the Required permissions section, as shown in the screenshot below.
</long-docs>