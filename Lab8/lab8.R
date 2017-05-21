library(igraph)
library(readr)
library(dplyr)

data <- read_csv("data.csv")

edges <- dplyr::select(data, content_rating, imdb_score)
edges <- edges[complete.cases(edges),]
nodes <- data.frame(unique(c(as.character(data$content_rating), as.character(data$imdb_score))))
g <- graph_from_data_frame(edges, vertices=nodes, directed = FALSE)
plot(g, layout=layout.reingold.tilford)

