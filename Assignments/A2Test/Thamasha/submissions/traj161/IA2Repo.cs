using System;
using A2.Models;

namespace A2.Data
{
	public interface IA2Repo
	{
        User Register(User user);
        User? GetUser(string username);
        public bool ValidLogin(string username, string password);
        Sign? PurchaseSign(string id);
        Organizer? GetOrganizer(string username);
        Event AddEvent(Event e);
        int EventCount();
        Event? GetEvent(int id);

    }
}

