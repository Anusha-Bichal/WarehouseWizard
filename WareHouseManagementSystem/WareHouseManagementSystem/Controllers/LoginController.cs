using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace WareHouseManagementSystem.Controllers
{
    public class LoginController : Controller
    {
        warehousedbEntities db = new warehousedbEntities();

        [Authorize(Roles = "Employee , Customer, Owner")]
        public ActionResult Index()
        {
            var loggedInUser = User.Identity.Name;
            var user = db.Logins.FirstOrDefault(x => x.username == loggedInUser);

            if (user != null)
            {
                user.password = new string('*', user.password.Length);

                if (user.Role == "Owner")
                {
                    var userList = db.Logins.ToList();
                    foreach (var u in userList)
                    {
                        u.password = new string('*', u.password.Length);
                    }
                    return View(userList);
                }
                else
                {
                    return View(new List<Login> { user });
                }
            }

            return View();
        }

        public ActionResult Login()
        {
            Login login = new Login();
            return View(login);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Login(Login model, string returnUrl)
        {
            var dataItem = db.Logins.FirstOrDefault(x => x.username == model.username);
            if (dataItem != null)
            { 
                
                    if (IsEncryptedPassword(dataItem.password))
                {
                    // Encrypted password, decrypt and compare
                    string decryptedPassword = PasswordHasher.DecryptPassword(dataItem.password);
                    if (decryptedPassword == model.password)
                    {
                        FormsAuthentication.SetAuthCookie(dataItem.username, false);
                        if (Url.IsLocalUrl(returnUrl) && returnUrl.Length > 1 && returnUrl.StartsWith("/")
                            && !returnUrl.StartsWith("//") && !returnUrl.StartsWith("/\\"))
                        {
                            return Redirect(returnUrl);
                        }
                        else
                        {
                            return RedirectToAction("Index");
                        }
                    }
                }

                else
                {
                    // Unencrypted password, compare directly
                    if (dataItem.password == model.password)
                    {
                        FormsAuthentication.SetAuthCookie(dataItem.username, false);
                        if (Url.IsLocalUrl(returnUrl) && returnUrl.Length > 1 && returnUrl.StartsWith("/")
                            && !returnUrl.StartsWith("//") && !returnUrl.StartsWith("/\\"))
                        {
                            return Redirect(returnUrl);
                        }
                        else
                        {
                            return RedirectToAction("Index");
                        }
                    }
                }
            }
           
            if (model.password != null) {

                ModelState.AddModelError("", "Invalid username/password");

            }
            ModelState.Remove("username");

            return View();
        }

        private bool IsEncryptedPassword(string password)
        {
            try
            {

                string decryptedPassword = PasswordHasher.DecryptPassword(password);
                return true;
            }
            catch
            {

                return false;
            }
        }




        public ActionResult SignOut()
        {
            FormsAuthentication.SignOut();

            // Clear session cookie
            Session.Abandon();

            // Clear authentication cookie by setting its expiration to a past date
            HttpCookie authenticationCookie = Request.Cookies[FormsAuthentication.FormsCookieName];
            if (authenticationCookie != null)
            {
                authenticationCookie.Expires = DateTime.Now.AddDays(-1);
                Response.Cookies.Add(authenticationCookie);
            }

            // Ensure the browser does not cache the page
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetNoStore();

            return RedirectToAction("Login", "Login");
        }




        public ActionResult Register()
        {

            //if (User.Identity.IsAuthenticated)
            //{
            //    return RedirectToAction("Index", "Login"); 
            //}

            Login login = new Login();
            return View(login);
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Register(Login obj)
        {
            string confirmPassword = Request.Form["confirmPassword"];
            string idnum = Request.Form["Employee Id"];

            try
            {
                // Check if a user with the same username already exists
                bool userExists = db.Logins.Any(x => x.username == obj.username);
                if (userExists)
                {
                    ModelState.AddModelError("", "Username already exists. Please choose a different username.");
                    return View(obj);
                }

                // Add password verification logic here
                if (obj.password != confirmPassword)
                {
                    ModelState.AddModelError("", "The password and confirmation password do not match.");
                    return View(obj);
                }

                // Validate the password against the regular expression pattern
                if (!Regex.IsMatch(obj.password, @"^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':""\\|,.<>/?]).{8,}$"))
                {
                    ModelState.AddModelError("", "The password must contain at least 1 number, 1 uppercase letter, 1 lowercase letter, 1 special character, and be at least 8 characters long.");
                    return View(obj);
                }

                // Hash the password
                string hashedPassword = PasswordHasher.EncryptPassword(obj.password);
                obj.password = hashedPassword;



                if (idnum != "52003768" && obj.Role == "Employee")
                {
                    ModelState.AddModelError("", "EmployId is incorrect, so you cannot enroll as employee");
                    return View(obj);
                }
                else
                {

                    db.Logins.Add(obj);
                    db.SaveChanges();
                }

                ViewBag.SuccessMessage = "Registered successfully.";
                return RedirectToAction("Login");
            }
            catch (Exception)
            {
                ViewBag.ErrorMessage = "There was an error processing the registration.";
                return View(obj);
            }
        }


        public ActionResult resetPassword()
        {

            Login login = new Login();
            return View(login);

        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult resetPassword(Login obj)
        {
            string confirmPassword = Request.Form["confirmPassword"];
            try
            {
                // Find the user by username
                var user = db.Logins.SingleOrDefault(x => x.username == obj.username);
                if (user == null)
                {
                    ModelState.AddModelError("", "User not found.");
                    return View(obj);
                }

                // Add password verification logic here
                if (obj.password != confirmPassword)
                {
                    ModelState.AddModelError("", "The password and confirmation password do not match.");
                    return View(obj);
                }

                // Validate the password against the regular expression pattern
                if (!Regex.IsMatch(obj.password, @"^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':""\\|,.<>/?]).{8,}$"))
                {
                    ModelState.AddModelError("", "The password must contain at least 1 number, 1 uppercase letter, 1 lowercase letter, 1 special character, and be at least 8 characters long.");
                    return View(obj);
                }

                // Hash the password
                string hashedPassword = PasswordHasher.EncryptPassword(obj.password);
                user.password = hashedPassword;

                // Save the updated password to the database
                db.SaveChanges();

                ViewBag.SuccessMessage = "Password reset successfully.";
                return RedirectToAction("Login");
            }
            catch (Exception)
            {
                ViewBag.ErrorMessage = "There was an error resetting the password.";
                return View(obj);
            }
        }

        [Authorize(Roles = "Employee , Customer")]
        public ActionResult Edit(int id)
        {
            var login = db.Logins.FirstOrDefault(x => x.Id == id);

            if (login == null)
            {
                return HttpNotFound();
            }

            // Decrypt the password for editing
            //login.password = PasswordHasher.DecryptPassword(login.password);

            return View(login);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(Login model)
        {
            if (ModelState.IsValid)
            {
                var login = db.Logins.FirstOrDefault(x => x.Id == model.Id);
                if (login == null)
                {
                    return HttpNotFound();
                }

                login.FirstName = model.FirstName;
                login.LastName = model.LastName;
                login.username = model.username;


                // Check if the password was changed


                db.SaveChanges();

                return RedirectToAction("Index");
            }
            else
            {
                var login = db.Logins.FirstOrDefault(x => x.Id == model.Id);
                if (login == null)
                {
                    return HttpNotFound();
                }

                login.FirstName = model.FirstName;
                login.LastName = model.LastName;
                login.username = model.username;


                // Check if the password was changed


                db.SaveChanges();

                return RedirectToAction("Index");
            }
        }
    


        [Authorize(Roles = "Employee , Customer")]
        public ActionResult Delete(int id)
        {
            // Find the user in the database by the provided ID
            var user = db.Logins.Find(id);

            if (user == null)
            {
                // User not found, return an error or redirect to an appropriate page
                return HttpNotFound();
            }

            // Remove the user from the database
            db.Logins.Remove(user);
            db.SaveChanges();

            // Redirect to a success page or return a success message
            return RedirectToAction("Index");
        }


    }
}

