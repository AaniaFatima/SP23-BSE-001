$(document).ready(function () {
  // Create a new post
  $("#createPostForm").submit(function (event) {
    event.preventDefault();

    const newPost = {
      title: $("#title").val(),
      body: $("#body").val(),
      userId: 1,
    };

    $.ajax({
      url: "https://jsonplaceholder.typicode.com/posts",
      type: "POST",
      data: JSON.stringify(newPost),
      contentType: "application/json; charset=UTF-8",
      success: function (data) {
        alert("Post created successfully!");
        console.log(data);
      },
    });
  });

  // Read posts
  $("#loadPosts").click(function () {
    $.ajax({
      url: "https://jsonplaceholder.typicode.com/posts",
      type: "GET",
      success: function (data) {
        $("#posts").empty(); // Clear previous posts

        const limit = 5; // Set the limit for the number of posts to load
        const limitedPosts = data.slice(0, limit); // Slice the data array to get the limited posts

        limitedPosts.forEach(function (post) {
          $("#posts").append(
            `<div class="post">
                <h3>${post.title}</h3>
                <p>${post.body}</p>
                <small>Post ID: ${post.id}</small>
            </div>`
          );
        });

        // data.forEach(function (post) {
        //     $('#posts').append(
        //         `<div class="post">
        //             <h3>${post.title}</h3>
        //             <p>${post.body}</p>
        //             <small>Post ID: ${post.id}</small>
        //         </div>`
        //     );
        // });
      },
    });
  });

  // Update a post
  $("#updatePostForm").submit(function (event) {
    event.preventDefault();

    const updatedPost = {
      title: $("#newTitle").val(),
      body: $("#newBody").val(),
    };

    const postId = $("#postId").val();

    $.ajax({
      url: `https://jsonplaceholder.typicode.com/posts/${postId}`,
      type: "PUT",
      data: JSON.stringify(updatedPost),
      contentType: "application/json; charset=UTF-8",
      success: function (data) {
        alert("Post updated successfully!");
        console.log(data);
      },
    });
  });

  // Delete a post
  $("#deletePostForm").submit(function (event) {
    event.preventDefault();

    const deleteId = $("#deleteId").val();

    $.ajax({
      url: `https://jsonplaceholder.typicode.com/posts/${deleteId}`,
      type: "DELETE",
      success: function () {
        alert("Post deleted successfully!");
      },
    });
  });
});
