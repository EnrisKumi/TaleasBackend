const connectToDatabase = require("./db");

const User = require("./models/user")
const PhoneNumber = require("./models/phonenumbers")

const createErrorResponse = (statusCode, message) => ({
  statusCode: statusCode || 501,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    error: message || "An Error occurred.",
  }),
});

const returnError = (error) => {
  console.log(error);
  if (error.name) {
    const message = `Invalid ${error.path}: ${error.value}`;
    callback(null, createErrorResponse(400, `Error:: ${message}`));
  } else {
    callback(
      null,
      createErrorResponse(error.statusCode || 500, `Error:: ${error.name}`)
    );
  }
};

module.exports.getUsers = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectToDatabase();
    const user = await User.find();
    if (!user) {
      callback(null, createErrorResponse(404, "No user Found."));
    }

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(user),
    });
  } catch (error) {
    returnError(error);
  }
};

module.exports.getOneUser = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.pathParameters.id;

  try {
    await connectToDatabase();
    const user = await User.findById(id);

    if (!user) {
      callback(null, createErrorResponse(404, `No user found with id: ${id}`));
    }

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(user),
    });
  } catch (error) {
    returnError(error);
  }
};

module.exports.postUser = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { name, surname, email, address } = JSON.parse(event.body);

  const user = new User({
    name,
    surname,
    email,
    address,
  });

  try {
    await connectToDatabase();
    console.log(user);
    const u = await User.create(user);
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(u),
    });
  } catch (error) {
    returnError(error);
  }
};

module.exports.updateUser = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body);

  const { name, surname, email, address } = data;

  try {
    await connectToDatabase();

    const user = await User.findById(event.pathParameters.id);

    if (user) {
      user.name = name || user.name;
      user.surname = surname || user.surname;
      user.email = email || user.email;
      user.address = address || user.address;
    }

    const newuser = await user.save();

    callback(null, {
      statusCode: 204,
      body: JSON.stringify(newuser),
    });
  } catch (error) {
    returnError(error);
  }
};

module.exports.deleteUser = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.pathParameters.id;

  try {
    await connectToDatabase();
    const user = await User.findByIdAndRemove(id);
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: `Removed user with id: ${user._id}`,
        user,
      }),
    });
  } catch (error) {
    returnError(error);
  }
};







module.exports.getPhoneNumbers = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectToDatabase();
    const pn = await PhoneNumber.find({});
    if (!pn) {
      callback(null, createErrorResponse(404, "No phone number Found."));
    }

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(pn),
    });
  } catch (error) {
    returnError(error);
  }
};

module.exports.getOnePhone = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.pathParameters.id;

  try {
    await connectToDatabase();
    const pn = await PhoneNumber.findById(id);

    if (!pn) {
      callback(null, createErrorResponse(404, `No phone number found with id: ${id}`));
    }

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(pn),
    });
  } catch (error) {
    returnError(error);
  }
};

module.exports.updatePhone = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body);

  const { providerName,number } = data;

  try {
    await connectToDatabase();

    const pn = await PhoneNumber.findById(event.pathParameters.id);

    if (pn) {
      pn.providerName = providerName || pn.providerName;
      pn.number = number || pn.number;
    }

    const newpn = await pn.save();

    callback(null, {
      statusCode: 204,
      body: JSON.stringify(newpn),
    });
  } catch (error) {
    returnError(error);
  }
};


module.exports.deletePhone = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.pathParameters.id;

  try {
    await connectToDatabase();
    const pn = await PhoneNumber.findByIdAndRemove(id);
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: `Removed phone number with id: ${pn._id}`,
        pn,
      }),
    });
  } catch (error) {
    returnError(error);
  }
};



module.exports.postPhoneNumbers = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.pathParameters.id;
  const { providerName, number } = JSON.parse(event.body);
  const pn = new PhoneNumber({
    providerName,
    number,
  });

 try {
  await connectToDatabase();
  console.log(pn);
  PhoneNumber.create(pn).then(function(dbPhone){
    return User.findOneAndUpdate({id},
      {
        $push: {phoneNumber: dbPhone.id}},{new:true});
   })
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(pn),
    });
  } catch (error) {
    returnError(error);
  }
};


module.exports.getPhoneUser = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.pathParameters.id;
  try {
    await connectToDatabase();
    const pn = await User.find({_id : id}).populate("phoneNumber");
    if (!pn) {
      callback(null, createErrorResponse(404, "No phone number Found."));
    }

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(pn),
    });
  } catch (error) {
    returnError(error);
  }
}