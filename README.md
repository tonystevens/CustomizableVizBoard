# CustomizableVizBoard
The goal of this viz board is to visualize the data user provide in the appropriate graph we provided.

# CustomizableVizBoard Purpose
For people working on services that returning meaningful data, CustomizableVizBoard is targeting to help them not only visualize their data in a proper way, but also administrate all their graphs of various services together. People would not need to worry about on creating diverse frontend graphs to display their data, all they need to do is configure a visualization service on their VizBoard.

# Example
#### Collapsible Indented Tree to display the JIRA-Crucible-Component structure
Given the data returned from the Jira-Analyzer, an internal tool that returns all the descendant Jiras, code reviews, and each component of the code changed, a collapsible indented tree would be a appropriate graph for displaying such relationships.
![alt tag](https://github.com/tonystevens/CustomizableVizBoard/blob/master/png/sample/indented-tree.png)

User creates this service by providing the link that returns the data.
![alt tag](https://github.com/tonystevens/CustomizableVizBoard/blob/master/png/sample/configure-service.png)

And user can play around with the tool to filter out the data they doesn't want, and highlight the data they like.
![alt tag](https://github.com/tonystevens/CustomizableVizBoard/blob/master/png/sample/configure-graph-filter.png)